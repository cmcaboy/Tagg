import React from 'react';
import {
  createStackNavigator,
  createMaterialTopTabNavigator,
  createAppContainer,
} from 'react-navigation';
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
import { analytics } from '../firebase';
import { formatAnalyticsError } from '../format/index';

const Tabs = createMaterialTopTabNavigator(
  {
    Settings: {
      screen: Settings,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor }: { tintColor: string }) => (
          <MaterialCommunityIcons name="account" size={24} color={tintColor} />
        ),
      },
    },
    StaggContainer: {
      screen: StaggContainer,
      navigationOptions: {
        tabBarLabel: 'StaggContainer',
        tabBarIcon: ({ tintColor }: { tintColor: string }) => (
          <Entypo name="heart" size={24} color={tintColor} />
        ),
      },
    },
    Matches: {
      screen: Matches,
      navigationOptions: {
        tabBarLabel: 'Matches',
        tabBarIcon: ({ tintColor }: { tintColor: string }) => (
          <Entypo name="chat" size={24} color={tintColor} />
        ),
      },
    },
  },
  {
    initialRouteName: 'StaggContainer',
    tabBarOptions: {
      activeTintColor: Platform.OS === 'ios' ? '#FFF' : '#FFF',
      showLabel: false,
      showIcon: true,
      style: {
        height: TAB_BAR_HEIGHT,
        backgroundColor: Platform.OS === 'ios' ? PRIMARY_COLOR : PRIMARY_COLOR,
        shadowColor: 'rgba(0, 0, 0, 0.24)',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 6,
        shadowOpacity: 1,
      },
    },
    lazy: true, // lazy loading
    swipeEnabled: false, // swipe between tabs
  },
);

const MainNavigator = createStackNavigator(
  {
    Home: {
      screen: Tabs,
      navigationOptions: {
        header: null,
      },
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
    cardStyle: {
      backgroundColor: '#ccc',
    },

    // headerTitleStyle: { height: Platform.OS === 'ios' ? 0 : TAB_BAR_HEIGHT },
    //   headerStyle: {
    //       height: 40,
    //     },
  },
);
// gets the current screen from navigation state
const getActiveRouteName = (navigationState: any): any => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
};

const NavWrapper = createAppContainer(MainNavigator);

// Automatically send screen views to Google Analytics
const GANavigationWrapper = () => (
  <NavWrapper
    onNavigationStateChange={(prevState, currentState) => {
      // console.log('currentState: ', currentState);
      // console.log('prevState: ', prevState);
      const currentScreen = getActiveRouteName(currentState);
      const prevScreen = getActiveRouteName(prevState);

      if (prevScreen !== currentScreen) {
        // the line below uses the Google Analytics tracker
        // change the tracker here to use other Mobile analytics SDK.
        analytics.setCurrentScreen(formatAnalyticsError(currentScreen));
        analytics.logEvent(formatAnalyticsError(`Page_${currentScreen}`));
        // console.log('currentScreen: ', currentScreen);
      }
    }}
  />
);

export default GANavigationWrapper;
