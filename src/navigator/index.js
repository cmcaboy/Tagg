import React from 'react';
import {TabNavigator, StackNavigator} from 'react-navigation';
import Settings from '../components/Settings';
import Leaderboard from '../components/Leaderboard';
import StaggContainer from '../components/StaggContainer';
import Matches from '../components/Matches';
import MessengerContainer from '../components/MessengerContainer';
import EditSettingsContainer from '../components/EditSettingsContainer';
import EditProfile from '../components/EditProfile';
import UserProfile from '../components/UserProfile';
import OpenDateList from '../components/OpenDateList';
import BidDate from '../components/BidDate';
// import { FontAwesome, Ionicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Platform} from 'react-native';
import {TAB_BAR_HEIGHT,PRIMARY_COLOR} from '../variables';

const Tabs = TabNavigator({
    Settings: {
        screen: Settings,
        navigationOptions: {
            tabBarLabel: 'Settings',
            tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name='account' size={24} color={tintColor} />
          }
    },
    StaggContainer: {
        screen: StaggContainer,
        navigationOptions: {
            tabBarLabel: 'StaggContainer',
            tabBarIcon: ({ tintColor }) => <Entypo name='heart' size={24} color={tintColor} />
          }
    },
    Matches: {
        screen: Matches,
        navigationOptions: {
            tabBarLabel: 'Matches',
            
            tabBarIcon: ({ tintColor }) => <Entypo name='chat' size={24} color={tintColor} />
          }
    }
}, {
        initialRouteName: 'StaggContainer',
        navigationOptions: {
          header: null
        },
        tabBarOptions: {
          activeTintColor: Platform.OS === 'ios' ? PRIMARY_COLOR : 'white',
          showLabel: false,
          showIcon: true,
          style: {
            height: TAB_BAR_HEIGHT,
            backgroundColor: Platform.OS === 'ios' ? 'white' : PRIMARY_COLOR,
            shadowColor: 'rgba(0, 0, 0, 0.24)',
            shadowOffset: {
              width: 0,
              height: 3
            },
            shadowRadius: 6,
            shadowOpacity: 1
          }
        }
});

const MainNavigator = StackNavigator({
    Home: {
        screen: Tabs
    },
    MessengerContainer: {
        screen: MessengerContainer
    },
    EditSettingsContainer: {
        screen: EditSettingsContainer
    },
    EditProfile: {
        screen: EditProfile
    },
    UserProfile: {
        screen: UserProfile
    },
    OpenDateList: {
        screen: OpenDateList
    },
    BidDate: {
        screen: BidDate
    },
},
{
    mode: 'card',
    headerMode: 'screen',
    headerTitleStyle: {height: TAB_BAR_HEIGHT}

}
);

export default MainNavigator;
