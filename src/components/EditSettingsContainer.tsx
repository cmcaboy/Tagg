import React, { Component } from 'react';
import { View } from 'react-native';
import { Query } from 'react-apollo';
import { Spinner, ErrorMessage } from './common';
import EditSettings from './EditSettings';
import { GET_SETTINGS } from '../apollo/queries';
// import { GET_ID } from '../apollo/local/queries';
import { PRIMARY_COLOR } from '../variables';
import { getSettings, getSettingsVariables } from '../apollo/queries/__generated__/getSettings';
// import { getId } from '../apollo/queries/__generated__/getId';

interface Props {
  hideNotifications: boolean;
  // refetchQueue?: () => any;
}
interface State {}

class GetSettings extends Query<getSettings, getSettingsVariables> {}
// class GetID extends Query<getId, {}> {}

class EditSettingsContainer extends Component<Props, State> {
  static navigationOptions = () => ({
    title: 'Settings',
    headerRight: <View />,
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: 22,
      color: PRIMARY_COLOR,
    },
  });

  render() {
    const { hideNotifications } = this.props;

    // return (
    //   <GetID query={GET_ID}>
    //     {({ loading, error, data }) => {
    //       // console.log('local data: ',data);
    //       // console.log('local error: ',error);
    //       // console.log('local loading: ',loading);
    //       if (loading) return <Spinner />;
    //       if (error) return <ErrorMessage error={error.message} />;
    // const { id } = data.user;

    return (
      <GetSettings query={GET_SETTINGS} fetchPolicy="network-only">
        {({
          loading, error, data, refetch,
        }) => {
          console.log('loading: ', loading);
          console.log('error: ', error);
          console.log('data: ', data);
          if (loading) return <Spinner />;
          if (error) return <ErrorMessage error={error.message} refetch={refetch} />;
          const {
            minAgePreference,
            maxAgePreference,
            distance,
            sendNotifications,
            followerDisplay,
            viewObjectionable,
            id,
          } = data.user;
          return (
            <EditSettings
              id={id}
              minAgePreference={minAgePreference}
              maxAgePreference={maxAgePreference}
              distance={distance}
              sendNotifications={sendNotifications}
              followerDisplay={followerDisplay}
              hideNotifications={hideNotifications}
              viewObjectionable={viewObjectionable}
              // refetchQueue={refetchQueue}
            />
          );
        }}
      </GetSettings>
    );
    //     }}
    //   </GetID>
    // );
  }
}

export default EditSettingsContainer;
