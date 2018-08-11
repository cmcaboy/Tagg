import React, { Component } from 'react';
import {
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Platform, 
    Image,
    Dimensions,
    ScrollView,
    Animated,
    PanResponder,
    LayoutAnimation,
    UIManager,
    ActivityIndicator,
    ImageBackground,
    Alert,
    Button,
    RefreshControl,
} from 'react-native';
import StaggCard from './StaggCard';
import StaggHeader from './StaggHeader';
import NewDateModal from './NewDateModal';
import FilterModal from './FilterModal';
import EmptyList from './EmptyList';
import {Card,Spinner,MyAppText} from './common';
import Foundation from 'react-native-vector-icons/Foundation';
import {checkPermissions,pushNotificationHandler} from '../services/push_notifications';
import toastMessage from '../services/toastMessage';
import gql from 'graphql-tag';
import Permissions from 'react-native-permissions';
import BackgroundGeolocation from 'react-native-background-geolocation';
import {FUNCTION_PATH} from '../variables/functions';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import {CARD_HEIGHT,CARD_FOOTER_HEIGHT,CARD_MARGIN} from '../variables';
import {firebase} from '../firebase';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = (0.25 * SCREEN_WIDTH);
const SWIPE_OUT_DURATION = 20;
const MIN_QUEUE_LENGTH = 2;

class Stagg extends Component {
    constructor(props) {
        super(props);

        this.locationTracker;

        this.state = {
            loading: false,
            newDateModal: false,
            filterModal: false,
            //queue: this.props.queue,
            refreshQueue: false,
            queue: new DataProvider((r1,r2) => r1 !== r2).cloneWithRows(
                this.props.queue.map(user => ({
                    type: !!user.hasDateOpen? 'WITH_FOOTER' : 'NORMAL',
                    user,
                }))),
        };

        this._layoutProvider = new LayoutProvider((i) => {
            return this.state.queue.getDataForIndex(i).type
        }, (type, dim) => {
            //console.log('type: ',type);
            switch(type) {
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
        this.onTokenRefreshListener; // Token check
        this.notificationListener; //  Listen for Notification
        this.notificationOpenedListener; // Listen for push notification press event if App is in Foreground or Background
    };

    flipNewDateModal = () => this.setState(prev => ({newDateModal:!prev.newDateModal}));
    flipFilterModal  = () => {
        //console.log('flip FilterModal status: ',this.state.filterModal);
        this.setState(prev => ({filterModal:!prev.filterModal}))
    };

    pushNotification = async () => {
        // Get Token
        const fcmToken = await firebase.messaging().getToken();
        if(fcmToken) {
            console.log('User has a device token: ',fcmToken);
            if(fcmToken !== this.props.pushToken) {
                console.log('push token has changed since last login. Uploading to datastore');
                this.props.startSetPushToken(fcmToken);
            }
        } else {
            console.log('user has not received a device token yet.')
        }
        // Listen for token refresh
        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(newFcmToken => this.props.startSetPushToken(newFcmToken));
        
        // Listen for Notification in the foreground
        this.notificationListener = firebase.notifications().onNotification((notification) => toastMessage({text:notification._title},
            () => pushNotificationHandler(this.props.id,notification._data,this.props.navigation)));

        // Listen for notification press while app is in the background
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened(notificationOpen => pushNotificationHandler(this.props.id,notificationOpen.notification._data,this.props.navigation));
        //const notificationOpen = await firebase.notifications().getInitialNotification();

    }

    componentDidMount = async () => {
        console.log('componentDidMount');
        this.trackLocation();
        // Check to see if App was opened via push notification press event
        // This is used if a notification was pressed when the app was closed.
        const notificationOpen = await firebase.notifications().getInitialNotification();

        // I could potentially put this in componentWillMount instead because it may navigate the user 
        // away and I wouldn't want to wait on the page load
        if(notificationOpen) {
            console.log('notificationOpen')
            const action = notificationOpen.action;
            const notification = notificationOpen.notification;
            pushNotificationHandler(this.props.id,notification._data,this.props.navigation);
        }
        if(checkPermissions()) {
            this.pushNotification();
        }
    }
    
    ComponentWillUnmount = () => {
        !!this.onTokenRefreshListener && this.onTokenRefreshListener();
        !!this.notificationListener && this.notificationListener();
        !!this.notificationOpenedListener && this.notificationOpenedListener();
        BackgroundGeolocation.removeListeners();
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        // The next time the component changes, add a spring affect to it.
        LayoutAnimation.spring();
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.queue !== this.props.queue) {
            this.setState({queue:new DataProvider((r1,r2) => r1 !== r2).cloneWithRows(
                nextProps.queue.map(user => ({
                    type: !!user.hasDateOpen? 'WITH_FOOTER' : 'NORMAL',
                    user,
                }))),
            })
        }
    }

    onLocation = (location) => console.log(' - [event] location: ',location)
    onError = (e) => console.log(' - [error] location: ',e);

    trackLocation = () => {

        //console.log('function path: ',FUNCTION_PATH + '/coords');

        BackgroundGeolocation.on('location', this.onLocation, this.onError);

        BackgroundGeolocation.ready({
            // Geolocation Config
            reset: false,
            desiredAccuracy: 100,
            distanceFilter: 100,
            // Activity Recognition
            stopTimeout: 5,
            // Application config
            debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            stopOnTerminate: false,   // <-- [Default: true] Allow the background-service to continue tracking when user closes the app.
            startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
            // HTTP / SQLite config
            //url: FUNCTION_PATH + '/coords',
            url: 'https://us-central1-manhattanmatch-9f9fe.cloudfunctions.net/coords',
            batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
            autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
            // headers: {              // <-- Optional HTTP headers
            //   "X-FOO": "bar"
            // },
            extras: {
                "id": this.props.id
            },
            params: {               // <-- Optional HTTP params
              "id": this.props.id
            }
          }, (state) => {
      
            // If we are not currently tracking, start tracking.
            if (!state.enabled) {
              ////
              // 3. Start tracking!
              //
              BackgroundGeolocation.start(function() {
                console.log("- Start success");
              });
            }
          });
    }

    renderCard = (prospect) => {
        // Instead of rendering a card, I could render an ImageBackground
        //console.log('stagg ancillary: ',prospect.ancillaryPics);

        // I could wrap each card with a mutation component right here
        return (
            <StaggCard 
                key={prospect.id}
                user={prospect}
                id={this.props.id}
                navigation={this.props.navigation}
            />
        )
    }

    rowRenderer = (type,data) => {
        //console.log('rowRenderer data: ',data);
        return this.renderCard(data.user);
    }

    render() {
        //console.log('this.props.queue: ',this.props.queue);
        //console.log('this.props.queue.length: ',this.props.queue.length);
        return (
            // I'll need to change this to a FlatList eventually
            <View style={styles.staggContainer}>
                <StaggHeader 
                    flipNewDateModal={this.flipNewDateModal}
                    flipFilterModal={this.flipFilterModal}
                    navigation={this.props.navigation}
                />
                <NewDateModal 
                    id={this.props.id}
                    isVisible={this.state.newDateModal} 
                    flipNewDateModal={this.flipNewDateModal}
                />
                <FilterModal 
                    isVisible={this.state.filterModal} 
                    flipFilterModal={this.flipFilterModal}
                    refetchQueue={() => {
                        this.props.refetchQueue()
                        this.setState((prev) => ({refreshQueue:!prev.refreshQueue}))
                    }}
                />

                {!!this.props.queue.length? (
                    <RecyclerListView 
                        style={{flex:1}}
                        onEndReached={() => {
                            console.log('end reached');
                            this.props.fetchMoreQueue()}}
                        onEndReachedThreshold={400}
                        rowRenderer={this.rowRenderer}
                        dataProvider={this.state.queue}
                        layoutProvider={this._layoutProvider}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.loading}
                                onRefresh={async () => {
                                    this.setState({loading:true});
                                    await this.props.refetchQueue();
                                    this.setState({loading:false,index:0});
                                }}
                            />
                        }
                    />
                ) : (
                    <EmptyList refetch={this.props.refetchQueue} text={`There is no one new in your area.`} subText={`Try again later.`} />
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    staggContainer: {
        flex: 1,
        //justifyContent: 'flex-start',
        //alignItems: 'center',
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
        elevation:4
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
        marginRight:30
    },
    button: {
        padding: 10,
        backgroundColor: 'purple',
        alignSelf: 'center',
        borderRadius: 5,
        margin: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 20
    },
    prospectText: {
        color: '#fff',
        fontSize: 32,
        marginLeft: 20,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    prospectView: {
        justifyContent: 'center',
        alignItems:'center'
    },
    prospectImage: {
        height:(SCREEN_HEIGHT*.83),
        justifyContent: 'flex-end',
        alignItems:'flex-start',
        backgroundColor: 'transparent',
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.5,
        // just like border radius, but with shadows
        shadowRadius: 2,
        // elevation makes items appear to jump out
        elevation: 1,
    }
});

export default Stagg;
