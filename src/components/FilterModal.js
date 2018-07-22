import React from 'react';
import {View,Image,Text,TouchableOpacity,Dimensions,StyleSheet} from 'react-native';
import {MyAppText, Button,HeaderCard, MyAppModal} from './common';
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

        !!this.props.refetchQueue && this.props.refetchQueue();
    }

    render() {
        return (
            <MyAppModal
                isVisible={this.props.isVisible}
                close={this.props.resetState}
            >
                <EditSettingsContainer 
                    hideNotifications={true}  
                />
                <Button onPress={this.resetState}>
                    Dismiss
                </Button>
            </MyAppModal>
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