import React from 'react';
import {View,Image,Text,TouchableOpacity,Dimensions,StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {MyAppText,Button,HeaderCard,HorizontalLine,MyTitleText} from './common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-datepicker';

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
        console.log('this.state newDateModal: ',this.state)
        return (
            <Modal
                isVisible={this.props.isVisible}
                transparent={false}
            >
                <View style={styles.container}>
                    <MyTitleText>New Date Request</MyTitleText>
                    <HorizontalLine />
                    <DatePicker 
                        mode="datetime"
                        date={this.state.datetime}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={(datetime) => {this.setState({datetime})}}
                    />
                    <View style={styles.buttonView}>
                        <Button  onPress={this.resetState}>
                            Submit
                        </Button>
                        <Button  onPress={this.resetState}>
                            Cancel
                        </Button>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: 'white',
        padding: 25,
        borderWidth: 1,
        borderRadius: 8,

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