import React from 'react';
import {View,Image,Text,TouchableOpacity,Dimensions,StyleSheet} from 'react-native';
import {MyAppText, Button,HeaderCard} from './common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PRIMARY_COLOR} from '../variables';

class StaggHeader extends React.Component  {
    // Takes the following props
    // -------------------------
    // onFollow() = function executed when user clicks follow button
    // onUnfollow() = function executed when user clicks on following button
    // user = object containing user information: name, age, distanceApart, school, work, profilePic
    // navigation = react navigation object
    // isFollowing = boolean that indicates whether the logged in user is following this user
    
    constructor(props) {
        super(props);
        this.state = {
            newDateModal: false,
            filter: false,
        }
    }

    viewDates  = () => console.log('view dates');
    newDate    = () => {
        console.log('newDate press');
        this.props.flipNewDateModal();
    }
    showFilter = () => {
        console.log('showFilter click');
        this.props.flipFilterModal();
    }

    render() {
        console.log('user: ',this.props.user);
        const {distance,age,totalBids,totalDates} = this.props;
        return (
            <HeaderCard styles={styles.overRide}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.newDate} style={{flex: 1}}>
                        <View style={[styles.headerItem]}>
                            <MyAppText style={styles.textStyle}>New Date</MyAppText>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.showFilter}  style={{flex: 1}}>
                        <View style={[styles.headerItem,{borderLeftWidth:1,borderLeftColor:'black'}]}>
                            <MyAppText style={styles.textStyle}>Filter</MyAppText>
                        </View>
                    </TouchableOpacity>
                </View>
            </HeaderCard>
        )
    }
}

// We put the styles in the component
const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        //backgroundColor: 'black',
    },
    textStyle: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    overRide: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#000',
    },
    headerItem: {
        justifyContent: 'space-around',
        flex: 1,
        
    }
});

export default StaggHeader;