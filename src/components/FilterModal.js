import React from 'react';
import {View,Image,Text,TouchableOpacity,Dimensions,StyleSheet,Modal} from 'react-native';
import {MyAppText, Button,HeaderCard} from './common';
import {PRIMARY_COLOR} from '../variables';

class FilterModal extends React.Component  {

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
        console.log('flip state request');
        this.props.flipFilterModal();
        this.setState(this.BlankState);
    }

    render() {
        console.log('FilterModal isVisible: ',this.props.isVisible);
        return (
            <Modal
                visible={this.props.isVisible}
                transparent={false}
                animationType='slide'
                onDismiss={this.resetState}
                onRequestClose={this.resetState}
            >
                <View>
                    <MyAppText>This is the FilterModal</MyAppText>
                    <Button onPress={this.resetState}>
                        Dismiss
                    </Button>
                </View>
            </Modal>
        )
    }
}

export default FilterModal;