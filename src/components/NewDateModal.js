import React from 'react';
import {View,Image,Text,TouchableOpacity,Dimensions,StyleSheet,TextInput} from 'react-native';
import {MyAppText,
    Button,
    HeaderCard,
    HorizontalLine,
    MyTitleText,
    MyAppModal
} from './common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-datepicker';
import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';

const NEW_DATE = gql`
mutation createDate($id: String!, $datetimeOfDate: String, $description: String) {
    createDate(id: $id, datetimeOfDate: $datetimeOfDate, description: $description) {
        id
        creationTime
        datetimeOfDate
        description
    }
}
`;

class NewDateModal extends React.Component  {

    constructor(props) {
        super(props);

        this.blankState = {
            time: '',
            date: '',
            location: '',
            description: '',
            datetime: '',
        }

        this.state = this.blankState;
    }

    resetState = () => {
        this.props.flipNewDateModal();
        this.setState(this.BlankState);
    }

    render() {
        console.log('NewDateModal isVisible: ',this.props.isVisible);
        console.log('this.state newDateModal: ',this.state);
        const {id} = this.props;
        return (
            <MyAppModal isVisible={this.props.isVisible} close={this.resetState}>
                <MyTitleText>New Date Request</MyTitleText>
                <HorizontalLine />
                <DatePicker 
                    style={styles.dateInput}
                    mode="datetime"
                    date={this.state.datetime}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    onDateChange={(datetime) => {this.setState({datetime})}}
                    placeholder="When will this date take place?"
                />
                <TextInput 
                    style={styles.textInput}
                    multiline={true}
                    placeholder="What kind of date are you looking for?"
                    onChangeText={(text) => this.setState({description:text})}
                    value={this.state.description}
                    maxLength={300}
                />
                <View style={styles.buttonView}>
                    <Mutation mutation={NEW_DATE}>
                        {(newDate) => (
                            <Button  onPress={() => {
                                this.props.flipNewDateModal();
                                return newDate({variables: {
                                    id,
                                    datetimeOfDate:this.state.datetime,
                                    description:this.state.description,
                                }})
                            }}
                            >
                                Submit
                            </Button>
                        )}
                    </Mutation>
                    <Button  onPress={this.resetState}>
                        Cancel
                    </Button>
                </View>
            </MyAppModal>
        )
    }
}

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        height: 75,
        width: 250,
        marginBottom: 10,
        borderRadius: 2,
    },
    dateInput: {
        width: 250,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 2,
        textAlign: 'left',
    },
    buttonStyle: {
        height: 50,
        width: 300,
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
})

export default NewDateModal;