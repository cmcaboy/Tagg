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
    TouchableWithoutFeedback,
    ActivityIndicator,
    ImageBackground,
    LayoutAnimation,
    NativeModules
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import UserProfilePhotos from './UserProfilePhotos';
import Collapsible from 'react-native-collapsible';
import {TAB_BAR_HEIGHT, PRIMARY_COLOR} from '../variables';
import {Card,MyAppText} from './common';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_MARGIN = 5;

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

class StaggCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isCollasped: true
    }
  }

  componentWillMount() {
    //LayoutAnimation.spring();
  }

  toggleCollaspe = () => {
    LayoutAnimation.spring();
    this.setState((prev) => ({isCollasped: !prev.isCollasped}))
  }

  render() {
    //console.log('stagg card');
    const {pics,style,name,description,work,school,id} = this.props; 
    const distanceApart = Math.round(this.props.distanceApart);

    const picHeight = SCREEN_HEIGHT - (CARD_MARGIN*2 + TAB_BAR_HEIGHT +25);
    const picWidth = SCREEN_WIDTH - CARD_MARGIN*2;

    //console.log('pics: ',pics);

    return (
            <View style={{margin:CARD_MARGIN}}>
    {/*
                <UserProfilePhotos 
                  pics={pics} 
                  picHeight={SCREEN_HEIGHT - (CARD_MARGIN*2 + TAB_BAR_HEIGHT +25)} 
                  picWidth={SCREEN_WIDTH - CARD_MARGIN*2}
                  customPicStyle={styles.customPicStyle} 
                  borderRadius={7}
                  cacheImages={this.props.cacheImages}
                >
    */}
                <ImageBackground 
                  key={pics[0]} 
                  source={{uri:pics[0]}} 
                  style={[
                    {height:picHeight},
                    {width:picWidth},
                    styles.customPicStyle,
                    {borderRadius:7}
                    ]}
                  imageStyle={{borderRadius: 7}}
                >
                <TouchableWithoutFeedback 
                  onPress={() => this.props.navigation.navigate('UserProfile',{id:id,name:name})}
                >
                    <View style={[{width:picWidth},{height:picHeight}]}></View>
                </TouchableWithoutFeedback>   
                  <TouchableWithoutFeedback 
                    onPress={() => this.toggleCollaspe()}
                    
                  >
                    <View style={styles.expandable}>
                    <View>
                      <View style={styles.firstLine}>
                        <MyAppText style={styles.nameText}>{name}</MyAppText> 
                        <MyAppText style={styles.distance}>{Math.round(distanceApart)} 
                          {Math.round(distanceApart) === 1 ? " mile away" : " miles away"}
                        </MyAppText>
                      </View>
                      {!!school && (
                        <View style={styles.subHeading}>
                            <Ionicons name="md-school" size={14} color="black" style={styles.schoolText}/>
                            <MyAppText style={[styles.schoolText,{paddingLeft:4}]}>{school}</MyAppText>
                        </View>
                      )}
                      {!!work && (
                        <View style={styles.subHeading}>
                            <MaterialIcons name="work" size={14} color="black" style={styles.schoolText}/>
                            <MyAppText style={[styles.schoolText,{paddingLeft:4}]}>{work}</MyAppText>
                        </View>
                      )}
                     
                    </View>
                      <View style={{display: this.state.isCollasped?'none':'flex'}}>
                        <View style={styles.horizontalLine}/>
                          <MyAppText>{description}</MyAppText> 
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                 </ImageBackground>
             {/* </UserProfilePhotos> */} 
            
          </View>
        )
      }
}

const styles = StyleSheet.create({
  customPicStyle: {
    borderWidth: 0,
    borderRadius: 7,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,
  },
  expandable: {
    position:'absolute',
    bottom: CARD_MARGIN,
    marginHorizontal: CARD_MARGIN,
    backgroundColor: '#fff',
    width: SCREEN_WIDTH - CARD_MARGIN*2*2, 
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 5,
    elevation: 4
  },
  subHeading: {
    flexDirection: 'row',
    marginTop: 2
  },
  schoolText: {
    fontSize: 12,
    opacity: 0.7
  },
  nameText: {
    fontSize: 24,
    color: PRIMARY_COLOR
},
  horizontalLine: {
    borderBottomColor:'black',
    borderBottomWidth:1,
    paddingVertical: 10,
    marginBottom: 10,
    opacity: 0.7
  },
  firstLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distance: {
    opacity: 0.7,
    fontSize: 12
  }
})

export default StaggCard;