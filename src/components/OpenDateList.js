import React from 'react';
import {View,Text,TouchableOpacity,Dimensions,StyleSheet} from 'react-native';
import {MyAppText,CirclePicture,Spinner} from './common';
import {Mutation,Query} from 'react-apollo';
import {GET_QUEUE} from '../apollo/queries';
import {FOLLOW,UNFOLLOW} from '../apollo/mutations';
import gql from 'graphql-tag';
import {List, ListItem,Container,Content} from 'native-base';

const GET_DATES = gql`
query user($id: String!) {
    user(id: $id) {
        id
        dateRequests {
            list {
                creationTime
                datetimeOfDate
                description
                num_bids
                open
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
        title: `${navigation.state.params.otherName}`,
        headerTitle: (
            <View style={styles.headerViewStyle}>
                {console.log('navigation params: ',navigation.state.params)}
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile',
                    {id:navigation.state.params.otherId,name:navigation.state.params.otherName})}>
                    <CirclePicture imageURL={navigation.state.params.otherPic} picSize="mini" />
                </TouchableOpacity>
                <MyAppText style={styles.textHeader}>{navigation.state.params.otherName}'s open dates</MyAppText>
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
        return (
            <Container>
                <Content>
                    <List>
                        <Query query={GET_DATES} variables={{id:this.props.navigation.state.params.otherId }}>
                        {({data, loading, error}) => {
                            if(loading) return <Spinner />
                            if(error) return <MyAppText>Error! {error.message}</MyAppText>
                            return data.user.dateRequests.list.map(date => (
                                <ListItem 
                                    key={date.id} 
                                    onPress={() =>  this.props.navigation.navigate('BidDate',{
                                        date,
                                        ...this.props.navigation.state.params,
                                    })}
                                >
                                    <View style={{flex:1,flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center'}}>
                                        <MyAppText>{date.datetiemOfDate} {date.description}</MyAppText>
                                        <MyAppText>{date.num_bids}</MyAppText>
                                    </View>
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

export default OpenDateList;