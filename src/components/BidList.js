import React from 'react';
import {View,TouchableOpacity,Dimensions,StyleSheet} from 'react-native';
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
                    <List>
                        <Query query={GET_BIDS} variables={{id:this.props.navigation.state.params.dateId }}>
                        {({data, loading, error}) => {
                            console.log('OpenDateList data: ',data);
                            if(loading) return <Spinner />
                            if(error) return <MyAppText>Error! {error.message}</MyAppText>
                            return data.otherBids.list.map(date => (
                                <ListItem thumbnail
                                    key={date.bidUser.id} 
                                    onPress={() =>  this.props.navigation.navigate('UserProfile',{
                                        id: date.bidUser.id,
                                        name: date.bidUser.name,
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
                                                    chooseWinner({
                                                        variables: {
                                                            winnerId: date.bidUser.id,
                                                            dateId: date.id,
                                                            id: this.props.navigation.state.params.id,
                                                        },
                                                        // Need to put in optimistic response and an update method
                                                    })
                                                    return this.props.navigation.goBack();
                                                }}>
                                                    <Text>Choose</Text>
                                                </Button>
                                            )}
                                        </Mutation>
                                    </Right>
                                </ListItem>
                            ))
                        }}
                        </Query>
                    </List>
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
    }
});

export default BidList;