import React from 'react';
import {View,Image,Text,TouchableOpacity,Dimensions,StyleSheet,TextInput} from 'react-native';
import {MyAppText,
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
import {Button} from 'native-base';

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

    closeModal = () => {
        console.log('resetState');
        console.log('isVisible: ',this.props.isVisible);
        if(this.props.isVisible) {
            this.props.flipNewDateModal();
        }
        this.setState(this.blankState);
    }

    render() {
        const {id} = this.props;
        return (
            <MyAppModal isVisible={this.props.isVisible} close={this.closeModal}>
                <MyTitleText>New Date Request</MyTitleText>
                <HorizontalLine />
                <View style={{alignItems:'stretch'}}>
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
                                <Button block onPress={() => {
                                    this.closeModal();
                                    return newDate({variables: {
                                        id,
                                        datetimeOfDate:this.state.datetime,
                                        description:this.state.description,
                                    }})
                                }}
                                >
                                    <MyAppText style={{fontWeight: 'bold',color: '#fff',fontSize: 18}}>Submit</MyAppText>
                                </Button>
                            )}
                        </Mutation>
                        <TouchableOpacity style={styles.cancelButton} onPress={this.closeModal}>
                            <MyAppText style={styles.cancelText}>Cancel</MyAppText>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </MyAppModal>
        )
    }
}

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        height: 75,
        textAlign: 'center',
        marginBottom: 10,
        borderRadius: 2,
    },
    dateInput: {
        width: '100%',
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 2,
        //textAlign: 'left',
    },
    buttonView: {
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    cancelText: {
        textAlign: 'center',
        fontSize: 16,
    },
    cancelButton: {
        marginVertical: 15,
    },
})

export default NewDateModal;