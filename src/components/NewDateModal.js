import React from 'react';
import {View,Image,Text,TouchableOpacity,Dimensions,StyleSheet,Modal} from 'react-native';
import {MyAppText, Button,HeaderCard} from './common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PRIMARY_COLOR} from '../variables';

class NewDateModal extends React.Component  {

    constructor(props) {
        super(props);

        this.blankState = {
            time: '',
            date: '',
            location: '',
            description: '',
        }

        this.state = this.BlankState;
    }

    resetState = () => {
        this.props.flipNewDateModal();
        this.setState(this.BlankState);
    }

    render() {
        console.log('NewDateModal isVisible: ',this.props.isVisible);
        return (
            <Modal
                visible={this.props.isVisible}
                transparent={false}
                animationType='slide'
                onDismiss={this.resetState}
                onRequestClose={this.resetState}
            >
                <View style={{flex: 1}}>
                    <MyAppText>This is the NewDateModal</MyAppText>
                    <Button onPress={this.resetState}>
                        Dismiss
                    </Button>
                </View>
            </Modal>
        )
    }
}

export default NewDateModal;