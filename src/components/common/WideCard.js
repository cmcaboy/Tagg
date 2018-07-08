import React from 'react';
import {View,Image,Text,TouchableOpacity} from 'react-native';
import {MyAppText} from './index.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class WideCard extends React.Component  {
    // Takes the following props
    // -------------------------
    // onFollow() = function executed when user clicks follow button
    // onUnfollow() = function executed when user clicks on following button
    // user = object containing user information: name, age, distanceApart, school, work, profilePic
    // navigation = react navigation object
    // isFollowing = boolean that indicates whether the logged in user is following this user
    
    constructor(props) {
        super(props);
        this.state = {
            isFollowing = this.props.isFollowing
        }
    }

    flipFollow = () => this.setState(prev => ({isFollowing:!prev.isFollowing}))
    follow = () => {
        this.flipFollow();
        this.props.onFollow();
    }
    unfollow = () => {
        this.flipFollow();
        this.props.onUnfollow();
    }
    followButton = () => {
        if(this.state.isFollowing) {
            return (
                <TouchableOpacity>
                    <Button onPress={this.unfollow}>Following</Button>
                </TouchableOpacity>
            )
        }
        return (
            <TouchableOpacity>
                <Button onPress={this.follow}>Follow</Button>
            </TouchableOpacity>
        )
    }
    render() {
        const {profilePic,school,work,name,distanceApart,age} = this.props.user;
        const {isFollowing,header} = this.props;
        return (
            <View style={[styles.containerStyle]}>
                <Image
                    source={{uri:profilePic}}
                    style={{height: 30,width: 30}}
                />
                <View style={styles.userInfo}>
                    <View>
                        <MyAppText>{name} {!!age? `, ${age}`:null}</MyAppText>
                        {!!school && (
                            <View style={subHeading}>
                                <Ionicons name="md-school" size={14} color="black" style={iconText}/>
                                <MyAppText style={schoolText}>{school}</MyAppText>
                            </View>
                        )}
                        {!!work && (
                            <View style={subHeading}>
                                <MaterialIcons name="work" size={14} color="black" style={iconText}/>
                                <MyAppText style={[schoolText,{paddingLeft:4}]}>{work}</MyAppText>
                            </View>
                        )} 
                    </View>
                    <View>
                        <MyAppText style={styles.distance}>{Math.round(distanceApart)} 
                          {Math.round(distanceApart) === 1 ? " mile away" : " miles away"}
                        </MyAppText>
                        {this.followButton()}
                    </View>
                </View>
            </View>
        )
    }
}

// We put the styles in the component
const styles = {
    containerStyle: {
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.5,
        // just like border radius, but with shadows
        shadowRadius: 2,
        // elevation makes items appear to jump out
        elevation: 1,
        // margin operates just as they do in css
        padding: 10,
        backgroundColor: '#FFFFFF',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: 200,
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subHeading: {
        flexDirection: 'row',
    },
    distance: {
        opacity: 0.7,
        fontSize: 12
    },
};

export {WideCard};