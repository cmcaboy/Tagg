import React,{Component} from 'react';
import {Spinner} from './common';
import {Text,View} from 'react-native';
import { Query } from 'react-apollo';
import EditSettings from './EditSettings';
import {GET_SETTINGS} from '../apollo/queries';
import { GET_ID } from '../apollo/local/queries';
import {PRIMARY_COLOR} from '../variables';

class EditSettingsContainer extends Component {
  constructor(props) {
    super(props);
  }

    static navigationOptions = ({navigation}) => ({
        title: `Settings`,
        headerRight: (<View></View>),
        headerTitleStyle: 
            {
                alignSelf: 'center',
                textAlign: 'center',
                fontWeight:'normal',
                fontSize: 22,
                color: PRIMARY_COLOR
            }
    })

  render() {
    return (
      <Query query={GET_ID}>
        {({ loading, error, data}) => {
          console.log('local data: ',data);
          console.log('local error: ',error);
          console.log('local loading: ',loading);
          if(loading) return <Spinner />
          if(error) return <Text>Error! {error.message}</Text>
          const id = data.user.id;
          console.log('id: ',id);
          return (
            <Query query={GET_SETTINGS} variables={{id}}>
                {({loading, error, data}) => {
                console.log('loading: ',loading);
                console.log('error: ',error);
                console.log('data: ',data);
                if(loading) return <Spinner />
                if(error) return <Text>Error! {error.message}</Text>
                const { minAgePreference, maxAgePreference, distance, sendNotifications } = data.user;
                    return <EditSettings 
                        id={id} 
                        minAgePreference={minAgePreference}
                        maxAgePreference={maxAgePreference}
                        distance={distance}
                        sendNotifications={sendNotifications}
                    />
                }}
            </Query>
            )

        }} 
      </Query>
    )
  }
}

export default EditSettingsContainer;