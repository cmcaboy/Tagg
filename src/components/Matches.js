import React,{Component} from 'react';
import {
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Platform, 
    ScrollView 
} from 'react-native';
import {CirclePicture,MyAppText,Spinner} from './common';
import MatchListItem from './MatchListItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PRIMARY_COLOR } from '../variables';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {GET_MATCHES} from '../apollo/queries';
import {GET_ID} from '../apollo/local/queries';

class Matches extends Component {
    constructor(props) {
        super(props);
    }
    noMatches = () => {
        return (
            <View style={styles.noMatches}>
                <Ionicons 
                    name="md-sad"
                    size={100}
                    color="black"
                />
                <MyAppText>You do not have any matches.</MyAppText>
                <MyAppText>Better get to swipping!</MyAppText>
            </View>
        )
    }
    renderContent({matches,id,name,pic}) {
        const {navigation} = this.props;

        if (matches.length === 0) {
            return this.noMatches();
        } else {
            return (
                <View style={styles.matchContainer}>
                    <View style={styles.newMatchesContainer}>
                        <MyAppText style={styles.heading}>New Matches</MyAppText>
                        <ScrollView
                            horizontal={true}
                        >
                        {matches.filter(match => !match.lastMessage).map((match) => {
                            return (
                                <TouchableOpacity 
                                    onPress={() => navigation.navigate('MessengerContainer',{
                                        matchId:match.matchId,
                                        id,
                                        otherId: match.user.id,
                                        name: name,
                                        otherName:match.user.name,
                                        pic:pic,
                                        otherPic: match.user.pics[0],
                                    })}
                                    key={match.user.id}
                                >
                                    <View style={styles.newMatch}>
                                        <CirclePicture imageURL={match.user.pics[0]} picSize="small"/>
                                        <MyAppText>{match.user.name}</MyAppText>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                        </ScrollView>
                    </View>
                    <View style={styles.messagesContainer}>
                        <MyAppText style={styles.heading}>Messages</MyAppText>
                        <ScrollView>
                            {matches.filter(match => (!!match.lastMessage && !!match.lastMessage.text)).map((match) => (
                            <MatchListItem 
                                key={match.matchId}
                                name={match.user.name} 
                                picture={match.user.pics[0]}
                                lastMessage={match.lastMessage.text}
                                onPress={() => navigation.navigate('MessengerContainer',{
                                    matchId:match.matchId,
                                    id,
                                    otherId: match.user.id,
                                    name: name,
                                    otherName: match.user.name,
                                    pic:pic,
                                    otherPic: match.user.pics[0],
                                })}
                            />
                        ))}
                        </ScrollView>
                    </View>
                </View>
            )
    }
    }
    render() {
        return (
            <Query query={GET_ID}>
            {({loading, error, data}) => {
              //console.log('local data: ',data);
              //console.log('local error: ',error);
              //console.log('local loading: ',loading);
              if(loading) return <Spinner />
              if(error) {
                console.log('error: ',error);  
                return <Text>Local Error! {error.message}</Text>
              }
              const { id } = data.user;
              return (
                <Query query={GET_MATCHES} variables={{id}}>
                  {({loading, error, data}) => {
                    //console.log('data in matches: ',data);
                    //console.log('error: ',error);
                    //console.log('loading: ',loading);
                    if(loading) return <Spinner />
                    if(error) return <Text>Error! {error.message}</Text>
                    console.log('data in matches: ',data);
                    return this.renderContent({matches:data.user.matchedDates.list,id,name:data.user.name,pic:data.user.profilePic})
                  }}
                  </Query>
              ) 
            }}
          </Query>
        )
                
        
    }
}

const styles = StyleSheet.create({
    matchContainer: {
        flex: 1,
        paddingLeft: 10,
        paddingTop:5,
        backgroundColor: '#FFFFFF'

    },
    newMatchesContainer: {
        flex: 2
    },
    messagesContainer: {
        flex: 5,
        //marginTop: 10
    },
    newMatch: {
        margin: 5,
        display:'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection:'column'
    },
    noMatches: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: {
        fontSize: 20,
        //fontWeight: '500',
        color: PRIMARY_COLOR,
        marginTop: 10,
        marginBottom: 5,
        //textDecorationLine: 'underline'
    }
});

export default Matches;