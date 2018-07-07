import React, {Component} from 'react';
import {
  View, 
  Text, 
  StyleSheet,
  Image, 
  ScrollView, 
  Dimensions, 
  ImageBackground,
  TouchableWithoutFeedback,
  Platform,
  Animated,
  PanResponder
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {PHOTO_ADD_URL} from '../variables';

// Add custom styling
// Add child props that get passed into background image

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = (0.05 * SCREEN_WIDTH)

class UserProfilePhotos extends Component {
  constructor(props){
    super(props);
    
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event,gesture) => {},
      onMoveShouldSetPanResponder: (evt, gestureState) => {
          //return true if user is swiping, return false if it's a single click
          //console.log('gestureState: ',{...gestureState});
          return !(Math.abs(gestureState.dx) <= 0.5 && Math.abs(gestureState.dy) <= 0.5) 
      },
      onPanResponderRelease: (event,gesture) => {
        if(gesture.dx > SWIPE_THRESHOLD) {
          this.clickLeftSide();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.clickRightSide();
        } 
      }
  })
  console.log('this.props: ',this.props);
  this.state = {
    loaded: false,
    currentImage: 0,
    pics: this.props.pics.filter(pic => pic !== PHOTO_ADD_URL),
    panResponder
  }

  }

  clickLeftSide = () => {
    if(this.state.currentImage > 0) {
      this.setState(prevState => ({currentImage:prevState.currentImage - 1}))
    }
  }
  
  clickRightSide = () => {
    if(this.state.currentImage < this.state.pics.length - 1) {
      this.setState(prevState => ({currentImage:prevState.currentImage + 1}))
    }
  }

  // cacheImages = () => {
  //     this.state.pics.map(async (pic,i) => {
  //       try {
  //         const newURI = await CacheManager.get(pic).getPath();
  //         !!newURI && this.setState((prevState) => ({
  //           pics: prevState.pics.map((picP,iP) => (i===iP) ? newURI : picP) 
  //         }));
  //       } catch(e) {
  //         console.log('error downloading images: ',e);
  //       }
  //     });
  // }

  componentDidMount = () => {
    // if (this.props.cacheImages) {
    //   this.cacheImages();
    // }
  }

  componentWillReceiveProps(nextProps) {
    /*
    if(nextProps.cacheImages) {
      this.cacheImages();
    }
    */
  }

  componentWillUnmount = async () => {
    //Platform.OS === 'ioss' && await CacheManager.clearCache();
    // await CacheManager.clearCache();
  }

  render() {
    const {userPics,userPhoto,touchablePics,leftClicker,rightClicker,picIndicator} = styles;
    const {picHeight = SCREEN_WIDTH,picWidth = SCREEN_WIDTH,customPicStyle,borderRadius} = this.props;
    //console.log('pics: ',this.state.pics);
    //console.log('current image: ',this.state.currentImage);
    //console.log('pic: ',this.state.pics[this.state.currentImage]);

    return (        
        <Animated.View style={userPics} {...this.state.panResponder.panHandlers}>
          {this.state.pics.map((pic,i) => (
              <ImageBackground 
                key={i} 
                source={{uri:pic}} 
                style={[
                  userPhoto,
                  {display:i === this.state.currentImage? 'flex':'none'},
                  {height:picHeight},
                  {width:picWidth},
                  customPicStyle,
                  {borderRadius:borderRadius}
                ]}
                imageStyle={{borderRadius: borderRadius}}
              >
                
                <View style={picIndicator}>
                  {this.state.pics.map((_,i2) => {
                    return i2 === this.state.currentImage ? (
                      <FontAwesome key={i2} name="circle" size={12} color="white" style={{backgroundColor:'transparent',paddingHorizontal:2}}/>
                    ) : (
                      <FontAwesome key={i2} name="circle-o" size={12} color="white" style={{backgroundColor:'transparent',paddingHorizontal:2}}/>
                    )
                  })}
                </View>
                
                <View style={touchablePics}>
                  <TouchableWithoutFeedback onPress={this.clickLeftSide}>
                    <View style={[leftClicker,{height:picHeight}]}></View>
                  </TouchableWithoutFeedback>          
                  <TouchableWithoutFeedback onPress={this.clickRightSide}>
                    <View style={[rightClicker,{height:picHeight}]} ></View>
                  </TouchableWithoutFeedback>          
                </View>
                </ImageBackground>
              ))}
              {this.props.children}
        </Animated.View>
    )
  }

}

const styles = StyleSheet.create({
  userPics: {
    //flex:2
  },
  userPhoto: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    justifyContent: 'flex-start',
    alignItems: 'center'
    
  },
  leftClicker:{
    width: SCREEN_WIDTH / 2,
    height: SCREEN_WIDTH * .9,
    
  },
  rightClicker: {
    width: SCREEN_WIDTH / 2,
    height: SCREEN_WIDTH *.9,
    
  },
  touchablePics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  picIndicator: {
    paddingVertical: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 3
  }
})

export default UserProfilePhotos;