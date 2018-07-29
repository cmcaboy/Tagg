import React from 'react';
import {View,Text,TouchableOpacity,Dimensions,StyleSheet,KeyboardAvoidingView} from 'react-native';
import {MyAppText,CirclePicture,Spinner,HorizontalLine} from './common';
import {Mutation,Query} from 'react-apollo';
import {GET_QUEUE} from '../apollo/queries';
import {FOLLOW,UNFOLLOW} from '../apollo/mutations';
import gql from 'graphql-tag';
import moment from 'moment';
import {Container,Content,Form,Input,Label,Item,Button,Card,CardItem,Body} from 'native-base';

const GET_DATE = gql`
query date($id: String!) {
    date(id: $id) {
        id
        datetimeOfDate
        description
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
        //const { datetimeOfDate, description, otherName} = this.props.navigation.state.params;
        const { datetimeOfDate, description} = this.props.navigation.state.params.date;
        return (
                
                    <Container style={styles.container}>
                        <Content>
                            <KeyboardAvoidingView>
                                <MyAppText style={styles.title}>Date/Time</MyAppText>
                                <MyAppText style={styles.description}>{moment(datetimeOfDate).format('MMM D, h:mm a')}</MyAppText>
                                <MyAppText style={styles.title}>Description</MyAppText>
                                <MyAppText style={styles.description}>{description}</MyAppText>
                                
                                <Form>
                                    <Item floatingLabel style={{marginLeft: 0}}>
                                        <Label>Date Location</Label>
                                        <Input autoFocus={true} />
                                    </Item>
                                    <Item floatingLabel style={{marginLeft: 0}}>
                                        <Label>Date Description</Label>
                                        <Input f/>
                                    </Item>
                                    <Button block style={{marginTop: 10}}>
                                        <MyAppText style={{fontWeight: 'bold',color: '#fff',fontSize: 18}}>Submit</MyAppText>
                                    </Button>
                                </Form>
                            </KeyboardAvoidingView>
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
    container: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 5,
    },
    description: {
        fontSize: 14,
        opacity: 0.75,
    }
});

export default BidDate;