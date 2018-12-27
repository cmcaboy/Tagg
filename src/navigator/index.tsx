import React from 'react';
import { createStackNavigator, createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Platform } from 'react-native';

import Settings from '../components/Settings';
import StaggContainer from '../components/StaggContainer';
import Matches from '../components/Matches';

import MessengerContainer from '../components/MessengerContainer';
import EditSettingsContainer from '../components/EditSettingsContainer';
import EditProfile from '../components/EditProfile';
import UserProfile from '../components/UserProfile';
import OpenDateList from '../components/OpenDateList';
import BidDate from '../components/BidDate';
import BidList from '../components/BidList';
import { TAB_BAR_HEIGHT, PRIMARY_COLOR } from '../variables';

const Tabs = createMaterialTopTabNavigator(
  {
    Settings: {
      screen: Settings,
      defaultNavigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor }: { tintColor: string }) => (
          <MaterialCommunityIcons name="account" size={24} color={tintColor} />
        ),
      },
    },
    StaggContainer: {
      screen: StaggContainer,
      defaultNavigationOptions: {
        tabBarLabel: 'StaggContainer',
        tabBarIcon: ({ tintColor }: { tintColor: string }) => (
          <Entypo name="heart" size={24} color={tintColor} />
        ),
      },
    },
    Matches: {
      screen: Matches,
      defaultNavigationOptions: {
        tabBarLabel: 'Matches',
        tabBarIcon: ({ tintColor }: { tintColor: string }) => (
          <Entypo name="chat" size={24} color={tintColor} />
        ),
      },
    },
  },
  {
    initialRouteName: 'StaggContainer',
    defaultNavigationOptions: {},
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
          height: 3,
        },
        shadowRadius: 6,
        shadowOpacity: 1,
      },
    },
  },
);

const MainNavigator = createStackNavigator(
  {
    Home: {
      screen: Tabs,
    },
    MessengerContainer: {
      screen: MessengerContainer,
    },
    EditSettingsContainer: {
      screen: EditSettingsContainer,
    },
    EditProfile: {
      screen: EditProfile,
    },
    UserProfile: {
      screen: UserProfile,
    },
    OpenDateList: {
      screen: OpenDateList,
    },
    BidDate: {
      screen: BidDate,
    },
    BidList: {
      screen: BidList,
    },
  },
  {
    mode: 'card',
    headerMode: 'screen',
    defaultNavigationOptions: {
      // headerForceInset: { top: 'never' },
    },

    // headerTitleStyle: { height: Platform.OS === 'ios' ? 0 : TAB_BAR_HEIGHT },
    //   headerStyle: {
    //       height: 40,
    //     },
  },
);

export default createAppContainer(MainNavigator);
