import React,{Component} from 'react';
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
import {Card,Spinner,MyAppText} from './common';
//import {Location,Notifications} from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import StaggCard from './StaggCard';
//import registerForNotifications from '../services/push_notifications';
import gql from 'graphql-tag';
import Permissions from 'react-native-permissions';
import BackgroundGeolocation from 'react-native-background-geolocation';
import {FUNCTION_PATH} from '../variables/functions';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = (0.25 * SCREEN_WIDTH);
const SWIPE_OUT_DURATION = 20;
const MIN_QUEUE_LENGTH = 2;

class Stagg extends Component {
    constructor(props) {
        super(props);

        const position = new Animated.ValueXY();

        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event,gesture) => {
                position.setValue({x:gesture.dx,y:gesture.dy})
            },
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                //return true if user is swiping, return false if it's a single click
                //console.log('gestureState: ',{...gestureState});
                return !(Math.abs(gestureState.dx) <= 0.5 && Math.abs(gestureState.dy) <= 0.5) 
            },
            onPanResponderRelease: (event,gesture) => {
                if(gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }
            }
        })

        this.locationTracker;

        this.position = position;
        this.state = {panResponder, position,index:0, status: 'granted', loading: false}
    }

    componentDidMount = () => this.trackLocation();
    
    ComponentWillUnmount = () => BackgroundGeolocation.removeListeners();

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        // The next time the component changes, add a spring affect to it.
        LayoutAnimation.spring();
    }


    askPermission = async () => {
        try {
            const response = await Permissions.request('location');
            //console.log('location request response: ',response);
    
            if(response === 'granted') {
                return this.trackLocation();
            }
    
            this.setState(() => ({status:response}));
        } catch(e) {
            console.warn('Error getting Location permission: ',e)
            this.setState(() => ({status: 'undetermined'}))
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

    forceSwipe(direction) {
        // same as spring, but the animation plays out slightly differently. Timing is more linear while
        // spring is more bouncy.
        //console.log('force swipe ',direction);
        Animated.timing(this.state.position, {
            toValue: { x:direction==='right'?SCREEN_WIDTH+150:-SCREEN_WIDTH-150, y:0},
            duration: SWIPE_OUT_DURATION
            // the start function can accept a callback.
        }).start(async () => this.onSwipeComplete(direction));
    }
    onSwipeComplete(direction) {
        // data is the array the comes in through props. It is the list of cards
        const {onSwipeLeft,onSwipeRight,queue} = this.props;
        const item = queue[this.state.index]

        direction === 'right' ? this.onSwipeRight(item.id) : this.onSwipeLeft(item.id);
        // Reset the card's position to be in default onscreen position

        // As an alternative, I could use shift on the array
        this.setState((prev) => ({index:prev.index + 1}));

        this.state.position.setValue({x:0,y:0});

        console.log(`queue length: ${this.props.queue.length}, index position: ${this.state.index}`)

        if((this.props.queue.length -1 - this.state.index) <= MIN_QUEUE_LENGTH ) {
            this.props.fetchMoreQueue();
        }
        
        //console.log('queue length: ', queue.length);
        //console.log('index: ', (this.state.index + 1));
        
    } 
    onSwipeRight = (id) => this.props.likeUser(id);
    onSwipeLeft  = (id) => this.props.dislikeUser(id);
    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: {x:0, y:0}
        }).start();
    }
    getCardStyle() {
        const {position} = this.state;
        // position contains references to x and y position at any given time
        // interpolate allows us to translate one scale to another.
        const rotate = position.x.interpolate({
            // inputRange - the horizontal distance that the card has been dragged left or right.
            // It is not good to hard code these values as the device size can be different.
            // Instead, we should tie the deminsions to the width of the screen.
            // We can also decrease the rotation by increasing the scale of inputRange or decreasing
            // the outputRange
            inputRange: [-SCREEN_WIDTH,0,SCREEN_WIDTH],
            outputRange: ['-60deg','0deg','60deg']
        });
        return {
            ...this.state.position.getLayout(),
            transform: [{rotate}]
        }
    }

    renderCard = (prospect,cacheImages) => {
        // Instead of rendering a card, I could render an ImageBackground
        //console.log('stagg ancillary: ',prospect.ancillaryPics);

        return (
            
            <StaggCard 
                key={prospect.id}
                id={prospect.id}
                pics={prospect.pics}
                name={prospect.name}
                work={prospect.work}
                school={prospect.school}
                description={prospect.description}
                distanceApart={prospect.distanceApart}
                cacheImages={!!cacheImages}
                navigation={this.props.navigation}
            />
            
        )
    }

    noProspects() {
        return (
            <ScrollView
                contentContainerStyle={styles.noProspects}
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
            >


                    <Ionicons 
                        name="md-sad"
                        size={100}
                        color="black"
                    />
                    <Text>There is no one new in your area.</Text>
                    <Text>Try again later.</Text>

                    <TouchableOpacity 
                        onPress={() => this.props.refetchQueue()} 
                        style={styles.noProspectsButton}
                    >
                        <Text style={styles.noProspectsText}>
                            Search Again
                        </Text>
                    </TouchableOpacity>

            </ScrollView>
            
        )
    }

    renderGranted = () => {
        //console.log('queue: ', this.props.queue);
        if ((this.props.queue.length) <= this.state.index) {
            return this.noProspects();
        }
        return (
            <Animated.View style={styles.staggContainer}>
                {this.props.queue.map((prospect,i) => {
                    //console.log('i',i);
                    //console.log('state index: ',this.state.index);
                    if(i < this.state.index) { return null }
                    else if (i === this.state.index) {
                        return (
                            <Animated.View 
                                key={prospect.id} 
                                style={[this.getCardStyle(),styles.cardStyle]}
                                {...this.state.panResponder.panHandlers}
                            >
                                {this.renderCard(prospect,true)}
                            </Animated.View>
                        )
                    } else {
                        return (
                            <Animated.View
                                key={prospect.id}
                                style={[styles.cardStyle]}
                                {...this.state.panResponder.panHandlers}
                            >
                                {this.renderCard(prospect)}
                            </Animated.View>
                        )
                    }
                }).reverse()}
            </Animated.View>
            )
    }

    render() {
        //console.log('status: ',this.state.status);
        if(this.state.status === 'granted'){
            return this.renderGranted();
        } else if(this.state.status === 'denied') {
            return this.renderGranted();
            // return (
            //     <View style={styles.center}>
            //         <Foundation name='alert' size={50}/>
            //         <Text style={{textAlign:'center'}}>
            //             You denied your location. You can fix this by visiting your settings and enabling location services for this app.
            //         </Text>
            //     </View>
            // )
        } else if (this.state.status === 'undetermined') {
            return (
                
                <View style={styles.center}>
                    <Foundation name='alert' size={50} />
                    <Text style={{textAlign: 'center'}}>
                        You need to enable location services for this app.
                    </Text>
                    <TouchableOpacity onPress={this.askPermission} style={styles.button}>
                        <Text style={styles.buttonText}>
                            Enable
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        } else if (this.state.status === null) {
            return (
                <Spinner />
            )
        }
    }
}

const styles = StyleSheet.create({
    staggContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
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
    noProspects: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noProspectsButton: {
        width: SCREEN_WIDTH * 0.7,
        //height: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#007aff',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10
    },
    noProspectsText: {
        alignSelf: 'center',
        color: '#007aff',
        fontSize: 16,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10
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
