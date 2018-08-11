import React from 'react';
import {View,TouchableOpacity,Dimensions,StyleSheet} from 'react-native';
import EmptyList from './EmptyList';
import {MyAppText,CirclePicture,Spinner} from './common';
import {Mutation,Query} from 'react-apollo';
//import {GET_QUEUE} from '../apollo/queries';
import {CHOOSE_WINNER} from '../apollo/mutations';
import gql from 'graphql-tag';
import {List,ListItem,Container,Content,Right,Left,Body,Text,Button,Thumbnail} from 'native-base';
import {formatDate,formatDescription} from '../format';

const GET_BIDS = gql`
query otherBids($id: String!) {
    otherBids(id: $id) {
        id
        cursor
        list {
            id
            datetimeOfBid
            bidDescription
            bidPlace
            bidUser {
                id
                name
                profilePic
            }
        }
    }
  }
`;



class BidList extends React.Component  {
    
    constructor(props) {
        super(props);
    }

    static navigationOptions = ({navigation}) => ({
        title: `${formatDate(navigation.state.params.datetimeOfDate)}`,
        headerTitle: (
            <View style={styles.headerViewStyle}>
                {console.log('navigation params: ',navigation.state.params)}
                <MyAppText style={styles.textHeader}>Select a winner</MyAppText>
                <View style={{width: 100}}></View>
            </View>
        ),
        headerTitleStyle: 
            {
                alignSelf: 'center',
                textAlign: 'center',
                fontWeight:'normal',
                fontSize: 22,
                color: 'black'
            }
    })

    render() {
        console.log('navigation paramss: ',this.props.navigation.state.params);
        return (
            <Container>
                <Content>
                    <Query query={GET_BIDS} variables={{id:this.props.navigation.state.params.dateId }}>
                    {({data, loading, error, refetch}) => {
                            console.log('BidList data: ',data);
                            if(loading) return <Spinner />
                            if(error) return <MyAppText>Error! {error.message}</MyAppText>
                            if(!data.otherBids.list.length) return <EmptyList refetch={refetch} text={`No one has bid on your date yet`} subText={`Be patient!`} />
                            return data.otherBids.list.map(date => (
                                <List>
                                    <ListItem thumbnail
                                        key={date.bidUser.id} 
                                        onPress={() =>  this.props.navigation.navigate('UserProfile',{
                                            id: date.bidUser.id,
                                            name: date.bidUser.name,
                                            hostId: this.props.navigation.state.params.id, 
                                        })}
                                    >
                                        <Left>
                                            <Thumbnail square source={{uri: date.bidUser.profilePic}}/>
                                        </Left>
                                        <Body>
                                            <Text>{date.bidUser.name}</Text>
                                            <Text note numberOfLines={1}>{date.bidPlace}</Text>
                                            <Text note numberOfLines={1}>{formatDescription(date.bidDescription)}</Text>
                                        </Body>
                                        <Right>
                                            <Mutation mutation={CHOOSE_WINNER}>
                                                {(chooseWinner) => (
                                                    <Button transparent onPress={() => {
                                                        console.log('winnerId: ', date.bidUser.id);
                                                        console.log('date.id: ', this.props.navigation.state.params.dateId);
                                                        console.log('id: ', this.props.navigation.state.params.id);
                                                        const {id, dateId, refetch} = this.props.navigation.state.params;
                                                        chooseWinner({
                                                            variables: {
                                                                winnerId: date.bidUser.id,
                                                                dateId,
                                                                id,
                                                            },
                                                            optimisticResponse: {
                                                                chooseWinner: {
                                                                    id: dateId,
                                                                    open: false,
                                                                    __typename: 'DateItem',
                                                                    optimistic: true,
                                                                },
                                                            },
                                                            update: (store,data) => {
                                                                console.log('store: ',store);
                                                                console.log('data: ',data);
                                                                const fragment = gql`
                                                                    fragment chooseWinner on DateItem {
                                                                        open
                                                                    }
                                                                `
                                                                let storeData = store.readFragment({
                                                                    id: data.data.chooseWinner.id,
                                                                    fragment: fragment,
                                                                });
                                                                store.writeFragment({
                                                                    id: data.data.chooseWinner.id,
                                                                    fragment: fragment,
                                                                    data: {
                                                                        ...storeData,
                                                                        open: data.data.chooseWinner.open,
                                                                    },
                                                                });
                                                                
                                                                const fragmentDateList = gql`
                                                                    fragment dateRequests on DateList {
                                                                        id
                                                                        list {
                                                                            id
                                                                        }
                                                                    }
                                                                    `;
                                                                
                                                                console.log(id);
                                                                storeData = store.readFragment({
                                                                    id: `${id}d`,
                                                                    fragment: fragmentDateList,
                                                                });
                                                                console.log(`storeData for ${id}d: `,storeData);
                                                                //storeData.forEach(datum => console.log('datum: ',datum));
                                                                
                                                                store.writeFragment({
                                                                    id: `${id}d`,
                                                                    fragment: fragmentDateList,
                                                                    data: {
                                                                        ...storeData,
                                                                        list: storeData.list.filter(date => date.id !== data.data.chooseWinner.id)
                                                                    }
                                                                });
                                                                
                                                                const fragmentMatchList = gql`
                                                                    fragment matchedDates on MatchList {
                                                                        id
                                                                        list {
                                                                            id
                                                                            user {
                                                                                id
                                                                                __typename
                                                                            }
                                                                            __typename
                                                                        }
                                                                    }
                                                                    `;
                                                                
                                                                // const newDate = {
                                                                //     id: data.data.chooseWinner.id,
                                                                //     matchId: data.data.chooseWinner.id,
                                                                //     user: {
                                                                //         id: date.bidUser.id,
                                                                //         __typename: 'User',
                                                                //     },
                                                                //     __typename: 'Match'
                                                                // }
                                                                
                                                                
                                                                // storeData = store.readFragment({
                                                                //     id: `${id}m`,
                                                                //     fragment: fragmentMatchList,
                                                                // });
                                                                // console.log(`storeData for ${id}m: ${storeData}`)
                                                                // store.writeFragment({
                                                                //     id: `${id}m`,
                                                                //     fragment: fragmentMatchList,
                                                                //     data: {
                                                                //         id: `${id}m`,
                                                                //         list: [newDate,...storeData.list],
                                                                //         __typename: 'MatchList'
                                                                //     }
                                                                // });

                                                                !data.data.chooseWinner.optimistic && refetch();

                                                            },
                                                        });
                                                        return this.props.navigation.goBack();
                                                    }}>
                                                        <Text>Choose</Text>
                                                    </Button>
                                                )}
                                            </Mutation>
                                        </Right>
                                    </ListItem>
                                </List>
                            ))
                        }}
                        </Query>
                    
                </Content>
            </Container>
        )
    }
}

// We put the styles in the component
const styles = StyleSheet.create({
    textHeader: {
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight:'bold',
        fontSize: 18,
        color: '#000',
        paddingLeft: 8
    },
    headerViewStyle: {
        flexDirection: 'row',
        paddingVertical: 5
    },
});

export default BidList;