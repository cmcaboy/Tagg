import React from 'react';
import {View,Image,Text,TouchableOpacity,Dimensions,StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {MyAppText, Button,HeaderCard} from './common';
import EditSettingsContainer from './EditSettingsContainer';
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
                isVisible={this.props.isVisible}
                transparent={false}
            >
                <View style={{flex: 1}}>
                    <EditSettingsContainer hideNotifications={true} />
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
        width: 200,
    }
})

export default FilterModal;