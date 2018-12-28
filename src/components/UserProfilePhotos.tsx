import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
  ViewStyle,
} from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { PHOTO_ADD_URL } from '../variables';
import { analytics } from '../firebase';

// Add custom styling
// Add child props that get passed into background image

const SCREEN_WIDTH = Dimensions.get('window').width;
// const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.05 * SCREEN_WIDTH;

interface Props {
  pics: string[];
  cacheImages: boolean;
}

interface State {
  currentImage: number;
  pics: string[];
  panResponder: any;
}

class UserProfilePhotos extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      // onPanResponderMove: (event, gesture) => {},
      onMoveShouldSetPanResponder: (evt, gestureState) => !(Math.abs(gestureState.dx) <= 0.5 && Math.abs(gestureState.dy) <= 0.5),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.clickLeftSide();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.clickRightSide();
        }
      },
    });

    const { pics } = this.props;

    this.state = {
      // loaded: false,
      panResponder,
      currentImage: 0,
      pics: pics.filter(pic => pic !== PHOTO_ADD_URL),
    };
  }

  componentDidMount = () => {
    const { cacheImages = true } = this.props;
    const { pics } = this.state;
    if (cacheImages) {
      FastImage.preload(pics.map(uri => ({ uri })));
    }
  };

  componentWillUnmount = async () => {
    // Platform.OS === 'ioss' && await CacheManager.clearCache();
    // await CacheManager.clearCache();
  };

  clickLeftSide = () => {
    const { currentImage } = this.state;

    if (currentImage > 0) {
      analytics.logEvent('Click_UserProfilePhotos_move_left');
      return this.setState(prevState => ({ currentImage: prevState.currentImage - 1 }));
    }

    analytics.logEvent('Click_UserProfilePhotos_move_left_end');
  };

  clickRightSide = () => {
    const { currentImage } = this.state;
    const { pics } = this.state;

    if (currentImage < pics.length - 1) {
      analytics.logEvent('Click_UserProfilePhotos_move_right');
      this.setState(prevState => ({ currentImage: prevState.currentImage + 1 }));
    }
    analytics.logEvent('Click_UserProfilePhotos_move_right_end');
  };

  render() {
    const {
      userPics, userPhoto, touchablePics, leftClicker, rightClicker, picIndicator,
    } = styles;
    const picHeight: number = SCREEN_WIDTH;
    const picWidth: number = SCREEN_WIDTH;
    const {
      pics,
      currentImage,
      panResponder: { panHandlers },
    } = this.state;
    // console.log('pics: ',this.state.pics);
    // console.log('current image: ',this.state.currentImage);
    // console.log('pic: ',this.state.pics[this.state.currentImage]);

    return (
      <Animated.View style={userPics} {...panHandlers}>
        {pics.map((pic, i) => (
          <FastImage
            key={pic}
            source={{ uri: pic }}
            style={[
              userPhoto,
              { display: i === currentImage ? 'flex' : 'none' },
              { height: picHeight },
              { width: picWidth },
              // customPicStyle,
              // { borderRadius },
            ]}
            // imageStyle={{ borderRadius }}
          >
            <View style={picIndicator}>
              {pics.map((uri, i2) => (i2 === currentImage ? (
                <FontAwesome
                  key={uri}
                  name="circle"
                  size={12}
                  color="white"
                  style={{ backgroundColor: 'transparent', paddingHorizontal: 2 }}
                />
              ) : (
                <FontAwesome
                  key={uri}
                  name="circle-o"
                  size={12}
                  color="white"
                  style={{ backgroundColor: 'transparent', paddingHorizontal: 2 }}
                />
              )))}
            </View>

            <View style={touchablePics}>
              <TouchableWithoutFeedback onPress={this.clickLeftSide}>
                <View style={[leftClicker, { height: picHeight }]} />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={this.clickRightSide}>
                <View style={[rightClicker, { height: picHeight }]} />
              </TouchableWithoutFeedback>
            </View>
          </FastImage>
        ))}
      </Animated.View>
    );
  }
}

interface Style {
  userPics: ViewStyle;
  userPhoto: ImageStyle;
  leftClicker: ViewStyle;
  rightClicker: ViewStyle;
  touchablePics: ViewStyle;
  picIndicator: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  userPics: {
    // flex: 2,
  },
  userPhoto: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  leftClicker: {
    width: SCREEN_WIDTH / 2,
    height: SCREEN_WIDTH * 0.9,
  },
  rightClicker: {
    width: SCREEN_WIDTH / 2,
    height: SCREEN_WIDTH * 0.9,
  },
  touchablePics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  picIndicator: {
    paddingVertical: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 3,
  },
});

export default UserProfilePhotos;
