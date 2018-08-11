import React from 'react';
import {View,Image,TouchableOpacity,StyleSheet} from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PRIMARY_COLOR} from '../variables';
import {formatDistanceApart} from '../format';
import {WideCard,MyAppText,FollowButton} from './common';

class StaggCard extends React.Component  {
    // Takes the following props
    // -------------------------
    // onFollow() = function executed when user clicks follow button
    // onUnfollow() = function executed when user clicks on following button
    // user = object containing user information: name, age, distanceApart, school, work, profilePic
    // navigation = react navigation object
    // isFollowing = boolean that indicates whether the logged in user is following this user
    
    constructor(props) {
        super(props);
    }

    onPress = () => this.props.navigation.navigate('UserProfile',{id:this.props.user.id,name:this.props.user.name,hostId: this.props.id})

    render() {
        // console.log('user: ',this.props.user);
        const {profilePic,school,work,name,distanceApart,age,isFollowing,hasDateOpen} = this.props.user;
        const { id } = this.props;
        return (
            <WideCard footer={!!hasDateOpen}>
                <View style={styles.bodyStyle}>
                <TouchableOpacity onPress={this.onPress}>
                    <Image
                        source={{uri:profilePic}}
                        style={{height: 115,width: 115, borderRadius: 5}}
                    />
                </TouchableOpacity>
                    <View style={styles.userInfo}>
                        <View style={{justifyContent:'space-between'}}> 
                            <View style={styles.description}>
                                <TouchableOpacity onPress={this.onPress}>
                                    <View style={{flexDirection: 'row'}}>
                                        <MyAppText style={styles.nameText}>{name} </MyAppText><MyAppText style={styles.ageText}>{!!age? `, ${age}`:null}</MyAppText>
                                    </View>
                                </TouchableOpacity>
                                {!!school && (
                                    <View style={styles.subHeading}>
                                        {/*<Ionicons name="md-school" size={14} color="black" style={styles.iconText}/>*/}
                                        <MyAppText style={styles.schoolText}>{school}</MyAppText>
                                    </View>
                                )}
                                {!!work && (
                                    <View style={styles.subHeading}>
                                        {/*<MaterialIcons name="work" size={14} color="black" style={styles.iconText}/>*/}
                                        <MyAppText style={[styles.schoolText]}>{work}</MyAppText>
                                    </View>
                                )} 
                            </View>
                            <View></View>
                        </View>
                        <View style={styles.rightCard}>
                            <MyAppText style={styles.distance}>
                                {formatDistanceApart(distanceApart)} 
                            </MyAppText>
                            <FollowButton name={name} isFollowing={isFollowing} id={id} followId={this.props.user.id} />
                        </View>
                    </View>
                </View>
                {!!hasDateOpen && (
                    <View style={styles.footer}>
                        <View
                            style={{
                                borderTopColor: 'gray',
                                borderTopWidth: 1,
                                opacity: 0.7,
                            }}
                        />
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('OpenDateList',{
                            id,
                            otherId:this.props.user.id,
                            otherName:this.props.user.name,
                            otherPic: this.props.user.profilePic,
                        })} >
                            <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center'}}>
                                {/*<AskButton onPress={() => this.props.navigation.navigate('OpenDateList',{
                                    id,
                                    otherId:this.props.user.id,
                                    otherName:this.props.user.name,
                                    otherPic: this.props.user.profilePic,
                                })} />
                            */}
                                <View style={styles.footerContent}>
                                    <MyAppText style={{color: '#fff',fontWeight: 'bold'}}>Needs a date on Sep 1 @ 7pm
                                    </MyAppText>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </WideCard>
        )
    }
}

// We put the styles in the component
const styles = StyleSheet.create({
    bodyStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 10,
        
    },
    rightCard: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end', 
    },
    description: {
        
        justifyContent: 'flex-start',
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        //alignItems: 'center',
        marginLeft: 8,
    },
    subHeading: {
        flexDirection: 'row',
    },
    nameText: {
        fontSize: 22,
        color: '#000',
        fontWeight: '400',
    },
    ageText: {
        fontSize: 22,
        //color: '#000',
        fontWeight: '100',
        opacity: 0.85,
    },
    distance: {
        opacity: 0.6,
        fontSize: 11,
        fontStyle: 'italic',
    },
    iconText: {
        fontSize: 14,
        opacity: 0.7,
      },
    schoolText: {
        fontSize: 11,
        opacity: 0.7,
    },
    footer: {
        backgroundColor: '#7CB342',
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        //paddingVertical: 5,
    },
    footerContent: {
        padding: 7,
    },
});

export default StaggCard;