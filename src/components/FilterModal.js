import React from 'react';
import {View,Image,Text,TouchableOpacity,Dimensions,StyleSheet} from 'react-native';
import {MyAppText, HeaderCard, MyAppModal} from './common';
import {Button} from 'native-base';
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

        this.state = this.blankState;
    }

    resetState = () => {
        console.log('flip state request');
        this.props.flipFilterModal();
        this.setState(this.blankState);

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
                <Button block style={{marginTop: 10}} onPress={this.resetState}>
                    <MyAppText style={{fontWeight: 'bold',color: '#fff',fontSize: 18}}>Done</MyAppText>
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