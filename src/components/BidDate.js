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

class BidDate extends React.Component  {
    
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
                <MyAppText style={styles.textHeader}>Ask {navigation.state.params.otherName} out!</MyAppText>
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
        console.log('navigation props: ',this.props.navigation.state.params);
        return (
            <Container>
                <Content>
                    <Text>Placeholder</Text>
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

export default BidDate;