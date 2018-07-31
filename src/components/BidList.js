import React from 'react';
import {View,TouchableOpacity,Dimensions,StyleSheet} from 'react-native';
import {MyAppText,CirclePicture,Spinner} from './common';
import {Mutation,Query} from 'react-apollo';
//import {GET_QUEUE} from '../apollo/queries';
import {FOLLOW,UNFOLLOW} from '../apollo/mutations';
import gql from 'graphql-tag';
import {List,ListItem,Container,Content,Right,Left,Body,Text,Button} from 'native-base';
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

class OpenDateList extends React.Component  {
    
    constructor(props) {
        super(props);
    }

    static navigationOptions = ({navigation}) => ({
        title: `${formatDate(navigation.state.params.datetimeOfDate)}`,
        headerTitle: (
            <View style={styles.headerViewStyle}>
                {console.log('navigation params: ',navigation.state.params)}
                <MyAppText style={styles.textHeader}>Select a winner for {formatDate(navigation.state.params.datetimeOfDate)}</MyAppText>
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
        console.log('navigation params: 'this.props.navigation.state.params);
        return (
            <Container>
                <Content>
                    <List>
                        <Query query={GET_BIDS} variables={{id:this.props.navigation.state.params.id }}>
                        {({data, loading, error}) => {
                            console.log('OpenDateList data: ',data);
                            if(loading) return <Spinner />
                            if(error) return <MyAppText>Error! {error.message}</MyAppText>
                            return data.otherBids.list.map(date => (
                                <ListItem 
                                    key={date.id} 
                                    onPress={() =>  this.props.navigation.navigate('UserProfile',{
                                        id: date.user.id,
                                        name: date.user.name,
                                    })}
                                >
                                    <Left>
                                        <Thumbnail square source={{uri: date.user.profilePic}}/>
                                    </Left>
                                    <Body>
                                        <Text>{date.user.name}</Text>
                                        <Text note numberOfLines={1}>{formatDescription(date.description)}</Text>
                                    </Body>
                                    <Right>
                                        <Button transparent>
                                            <Text>Choose</Text>
                                        </Button>
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