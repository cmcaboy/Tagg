import React from 'react';
import {View,Image,Text,TouchableOpacity,Dimensions,StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
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
                isVisible={this.props.isVisible}
                transparent={false}
            >
                <View style={{flex: 1}}>
                    <MyAppText>This is the NewDateModal</MyAppText>
                    <Button buttonStyle={styles.buttonStyle} onPress={this.resetState}>
                        Dismiss
                    </Button>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        height: 100,
        width: 300,
    }
})

export default NewDateModal;