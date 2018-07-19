import React from 'react';
import {View,Image,Text,TouchableOpacity,Dimensions,StyleSheet} from 'react-native';;
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PRIMARY_COLOR} from '../variables';
import {WideCard,MyAppText,Button} from './common';
import {Mutation} from 'react-apollo';
import {GET_QUEUE} from '../apollo/queries';
import {UPDATE_FOLLOW} from '../apollo/mutations';

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
        this.state = {
            isFollowing: this.props.user.isFollowing
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
    onPress = () => this.props.navigation.navigate('UserProfile',{id:this.props.user.id,name:this.props.user.name})
    followButton = ({isFollowing = false,updateFollowStart}) => {
        if(isFollowing) {
            return (
                <TouchableOpacity>
                    <Button invertColors={true} buttonStyle={styles.buttonStyle} textStyle={styles.buttonText} onPress={updateFollowStart(!isFollowing)}>Following</Button>
                </TouchableOpacity>
            )
        }
        return (
            <TouchableOpacity>
                <Button buttonStyle={styles.buttonStyle} textStyle={styles.buttonText} onPress={updateFollowStart(!isFollowing)}>Follow</Button>
            </TouchableOpacity>
        )
    }
    render() {
        //console.log('user: ',this.props.user);
        const {profilePic,school,work,name,distanceApart,age,isFollowing,hasDateOpen} = this.props.user;
        return (
            <WideCard>
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
                            <MyAppText style={styles.distance}>{Math.round(distanceApart)} 
                                {Math.round(distanceApart) === 1 ? " mile away" : " miles away"}
                            </MyAppText>
                            <Mutation mutation={UPDATE_ISFOLLOWING} ignoreResults={false}>
                                {(updateFollow,_) => {
                                    const updateFollowStart = (isFollowing) => {
                                        updateFollow({
                                            variables: {
                                                id,
                                                isFollowing
                                            },
                                            optimisticResponse: {
                                                __typename: "Mutation",
                                                updateFollow: {
                                                    isFollowing
                                                }
                                            },
                                            update: (store,data) => {
                                                console.log('updateFollow store: ',store)
                                                let storeData = store.readQuery({
                                                    query: GET_QUEUE,
                                                    variables: {id},
                                                });

                                                //store.writeQuery({query: GET_QUEUE, data: storeData})
                                            },
                                               
                                        })
                                    }
                                    return this.followButton({isFollowing, updateFollowStart})
                                }}
                            </Mutation>
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
                        <View style={styles.footerContent}><MyAppText style={{color: 'red'}}>{name} is looking for a date on <MyAppText style={{fontWeight: 'bold'}}>Sep 1 @ 7pm</MyAppText></MyAppText></View>
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
    buttonStyle: {
        borderRadius: 10,
        //padding: 4,
    },
    buttonText: {
        fontSize: 12,
        fontWeight: '500',
        padding: 4,
    },
    rightCard: {
        flexDirection: 'column',
        justifyContent: 'space-between',
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
    fontSize: 13,
    opacity: 0.7,
    },
    footer: {

    },
    footerContent: {
        padding: 10,
        color: 'red',
    },
});

export default StaggCard;