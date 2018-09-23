import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  UIManager,
  RefreshControl,
} from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import StaggCard from './StaggCard';
import StaggHeader from './StaggHeader';
import NewDateModal from './NewDateModal';
import FilterModal from './FilterModal';
import EmptyList from './EmptyList';
import { checkPermissions, pushNotificationHandler } from '../services/push_notifications';
import toastMessage from '../services/toastMessage';
import { CARD_HEIGHT, CARD_FOOTER_HEIGHT, CARD_MARGIN, GEO_LOCATION_URL } from '../variables';
import { firebase } from '../firebase';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Stagg extends Component {
  constructor(props) {
    super(props);

    this.locationTracker = null;

    const { queue } = this.props;

    this.state = {
      loading: false,
      newDateModal: false,
      filterModal: false,
      queue: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
        queue.map(user => ({
          type: user.hasDateOpen ? 'WITH_FOOTER' : 'NORMAL',
          user,
        })),
      ),
    };

    this._layoutProvider = new LayoutProvider((i) => {
      const { queue } = this.state;
      return queue.getDataForIndex(i).type;
    }, (type, dim) => {
      // console.log('type: ',type);
      switch (type) {
        case 'NORMAL':
          dim.width = SCREEN_WIDTH;
          dim.height = CARD_HEIGHT + CARD_MARGIN;
          break;
        case 'WITH_FOOTER':
          dim.width = SCREEN_WIDTH;
          dim.height = CARD_HEIGHT + CARD_FOOTER_HEIGHT + CARD_MARGIN;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    });

    // Used for Firebase Cloud Messaging
    // ----------------------------------
    // Token check
    this.onTokenRefreshListener = null;
    //  Listen for Notification
    this.notificationListener = null;
    // Listen for push notification press event if App is in Foreground or Background
    this.notificationOpenedListener = null;
    // ----------------------------------
  }

  componentDidMount = async () => {
    const { id, navigation } = this.props;

    // Track location via react-native-background-geolcation
    this.trackLocation();

    // Check to see if App was opened via push notification press event
    // This is used if a notification was pressed when the app was closed.
    const notificationOpen = await firebase.notifications().getInitialNotification();

    // I could potentially put this in componentWillMount instead because it may navigate the user 
    // away and I wouldn't want to wait on the page load. However, this should work for now.
    if (notificationOpen) {
      console.log('notificationOpen');
      // action prop also available from notificationOpen
      const { notification } = notificationOpen;
      pushNotificationHandler(id, notification._data, navigation);
    }
    console.log('CheckPermissions: ', checkPermissions());
    if (checkPermissions()) {
      this.pushNotification();
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { queue } = this.state;
    if (nextProps.queue !== queue) {
      this.setState({
        queue: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
          nextProps.queue.map(user => ({
            type: user.hasDateOpen ? 'WITH_FOOTER' : 'NORMAL',
            user,
          })),
        ),
      });
    }
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    // The next time the component changes, add a spring affect to it.
    LayoutAnimation.spring();
  }

  onLocation = location => console.log(' - [event] location: ', location);

  onError = e => console.log(' - [error] location: ', e);

  ComponentWillUnmount = () => {
    !!this.onTokenRefreshListener && this.onTokenRefreshListener();
    !!this.notificationListener && this.notificationListener();
    !!this.notificationOpenedListener && this.notificationOpenedListener();
    BackgroundGeolocation.removeListeners();
  }

  pushNotification = async () => {
    const { pushToken, startSetPushToken, id, navigation } = this.props;
    console.log('firebase messaging: ', firebase.messaging());
    // Get Token
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log('User has a device token: ', fcmToken);
      if (fcmToken !== pushToken) {
        console.log('push token has changed since last login. Uploading to datastore');
        startSetPushToken(fcmToken);
      }
    } else {
      console.log('user has not received a device token yet.')
    }
    // Listen for token refresh
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(newFcmToken => startSetPushToken(newFcmToken));

    // Listen for Notification in the foreground
    this.notificationListener = firebase.notifications().onNotification(notification => toastMessage({ text: notification._title },
      () => {
        console.log('notification: ', notification);
        return pushNotificationHandler(id, notification._data, navigation);
      }));

    // Listen for notification press while app is in the background
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(notificationOpen => pushNotificationHandler(id, notificationOpen.notification._data, navigation));
    // const notificationOpen = await firebase.notifications().getInitialNotification();
}

  flipNewDateModal = () => this.setState(prev => ({ newDateModal: !prev.newDateModal }));

  flipFilterModal = () => {
    // console.log('flip FilterModal status: ',this.state.filterModal);
    this.setState(prev => ({ filterModal: !prev.filterModal }));
  };

  trackLocation = () => {
    const { id } = this.props;

    BackgroundGeolocation.on('location', this.onLocation, this.onError);

    BackgroundGeolocation.ready({
      // Geolocation Config
      reset: true,
      desiredAccuracy: 100,
      distanceFilter: 100,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_NONE,
      stopOnTerminate: false,   // <-- [Default: true] Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      // url: FUNCTION_PATH + '/coords',
      url: GEO_LOCATION_URL,
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      // headers: {              // <-- Optional HTTP headers
      //   "X-FOO": "bar"
      // },
      extras: {
        id,
      },
      params: { // <-- Optional HTTP params
        id,
      },
    }, (state) => {
      // If we are not currently tracking, start tracking.
      if (!state.enabled) {
        //
        // 3. Start tracking!
        //
        BackgroundGeolocation.start(() => {
          console.log(' - Start success');
        });
      }
    });
  }

  rowRenderer = (type, data) => this.renderCard(data.user);

  renderCard = (prospect) => {
    // Instead of rendering a card, I could render an ImageBackground
    // console.log('stagg ancillary: ',prospect.ancillaryPics);

    const { id, navigation } = this.props;

    return (
      <StaggCard
        key={prospect.id}
        user={prospect}
        hostId={id}
        navigation={navigation}
      />
    );
  }

  render() {
    const { navigation, id, refetchQueue, fetchMoreQueue  } = this.props;
    const { queue, newDateModal, filterModal, loading } = this.state;
    console.log('queue: ', queue);
    console.log('queue.length: ', queue._data.length);
    return (
      // I'll need to change this to a FlatList eventually
      <View style={styles.staggContainer}>
        <StaggHeader
          flipNewDateModal={this.flipNewDateModal}
          flipFilterModal={this.flipFilterModal}
          navigation={navigation}
        />
        <NewDateModal
          id={id}
          isVisible={newDateModal}
          flipNewDateModal={this.flipNewDateModal}
        />
        <FilterModal
          isVisible={filterModal}
          flipFilterModal={this.flipFilterModal}
          refetchQueue={() => {
            refetchQueue();
            this.setState(prev => ({ refreshQueue: !prev.refreshQueue }));
          }}
        />

        {queue._data.length ? (
          <RecyclerListView
            style={{ flex: 1 }}
            onEndReached={() => {
              console.log('end reached');
              fetchMoreQueue();
            }}
            onEndReachedThreshold={400}
            rowRenderer={this.rowRenderer}
            dataProvider={queue}
            layoutProvider={this._layoutProvider}
            refreshControl={(
              <RefreshControl
                refreshing={loading}
                onRefresh={async () => {
                  this.setState({ loading: true });
                  await refetchQueue();
                  this.setState({ loading: false });
                }}
              />
            )}
          />
        ) : (
          <EmptyList refetch={refetchQueue} text="There is no one new in your area." subText="Try again later." />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  staggContainer: {
    flex: 1,
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  header: {
    backgroundColor: 'black',
  },
  cardStyle: {
    width: SCREEN_WIDTH,
    // absolute position does not seem to work as a child of ScrollView
    position: 'absolute',
    elevation: 4,
  },
  undeterminedContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  button: {
    padding: 10,
    backgroundColor: 'purple',
    alignSelf: 'center',
    borderRadius: 5,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  prospectText: {
    color: '#fff',
    fontSize: 32,
    marginLeft: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  prospectView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  prospectImage: {
    height: (SCREEN_HEIGHT * 0.83),
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    // just like border radius, but with shadows
    shadowRadius: 2,
    // elevation makes items appear to jump out
    elevation: 1,
  },
});

export default Stagg;
