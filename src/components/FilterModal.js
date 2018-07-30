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

    closeModal = () => {
        console.log('flip state request');
        console.log('isVisible: ',this.props.isVisible);
        if(this.props.isVisible) {
            this.props.flipFilterModal();
        }
        this.setState(this.blankState);

        !!this.props.refetchQueue && this.props.refetchQueue();
    }

    render() {
        return (
            <MyAppModal
                isVisible={this.props.isVisible}
                close={this.closeModal}
            >
                <EditSettingsContainer 
                    hideNotifications={true}  
                />
                <Button block style={{marginTop: 10}} onPress={this.closeModal}>
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