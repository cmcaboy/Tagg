import React, { Component } from 'react';
import { View } from 'react-native';
import { Query } from 'react-apollo';
import { Spinner, ErrorMessage } from './common';
import EditSettings from './EditSettings';
import { GET_SETTINGS } from '../apollo/queries';
import { GET_ID } from '../apollo/local/queries';
import { PRIMARY_COLOR } from '../variables';

class EditSettingsContainer extends Component {
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
    const { hideNotifications, refetchQueue } = this.props;

    return (
      <Query query={GET_ID}>
        {({ loading, error, data }) => {
          // console.log('local data: ',data);
          // console.log('local error: ',error);
          // console.log('local loading: ',loading);
          if (loading) return <Spinner />;
          if (error) return <ErrorMessage error={error.message} />;
          const { id } = data.user;

          return (
            <Query query={GET_SETTINGS} variables={{ id }}>
              {({
                loading, error, data, refetch,
              }) => {
                // console.log('loading: ',loading);
                // console.log('error: ',error);
                // console.log('data: ',data);
                if (loading) return <Spinner />;
                if (error) return <ErrorMessage error={error.message} refetch={refetch} />;
                const {
                  minAgePreference,
                  maxAgePreference,
                  distance,
                  sendNotifications,
                  followerDisplay,
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
                    refetchQueue={refetchQueue}
                  />
                );
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}

export default EditSettingsContainer;
