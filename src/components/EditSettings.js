import React,{Component} from 'react';
import {Text,View,Slider,Switch,StyleSheet,Dimensions} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {Card,Button} from './common';
import { PRIMARY_COLOR } from '../variables';
import { db } from '../firebase';
import { testFemale, testMale } from '../tests/testUser';
import uuid from 'uuid';
import { Query, Mutation } from 'react-apollo';
//import gql from 'graphql-tag';
import {GET_SETTINGS} from '../apollo/queries';
import {SET_AGE_PREFERENCE,SET_DISTANCE,SET_NOTIFICATIONS} from '../apollo/mutations';
import { 
  SET_AGE_PREFERENCE_LOCAL, 
  SET_DISTANCE_LOCAL, 
  SET_NOTIFICATIONS_LOCAL } from '../apollo/local/mutations';
import { 
  GET_ID,
  GET_AGE_PREFERENCE_LOCAL, 
  GET_DISTANCE_LOCAL, 
  GET_NOTIFICATIONS_LOCAL } from '../apollo/local/queries';

const SLIDER_WIDTH = Dimensions.get('window').width * 0.85;
const isBoolean = val => 'boolean' === typeof val;

class EditSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ageValues: [this.props.minAgePreference,this.props.maxAgePreference],
      distance: this.props.distance,
      sendNotifications: this.props.sendNotifications,
    } 
  }
    
  notificationChange = () => {
    this.setState((prevState) => ({sendNotifications:!prevState.sendNotifications}))
    console.log(this.state.sendNotifications);
  }

  render() {
    const {ageValues,distance,sendNotifications} = this.state;
    const {id,showNotifications} = this.props;
  return (
    <View style={styles.containerStyle}>
    <Card>
      <View style={styles.sliderContainer}>
        <View style={styles.titleSlider}>
          <Text>Age Preference </Text>
          <Text>{ageValues[0]} - {ageValues[1]}</Text>
        </View>
        <View style={{paddingTop:20,width:SLIDER_WIDTH}}>
          <Mutation mutation={SET_AGE_PREFERENCE}>
            {(updateAgePreference, { data }) => {
              return (
                <MultiSlider 
                  containerStyle={{height: 12}}
                  markerOffsetX={0}
                  sliderLength={!!this.props.hideNotifications? (SLIDER_WIDTH * .70) : SLIDER_WIDTH}
                  markerStyle={styles.markerStyle}
                  step={1}
                  values={ageValues}
                  max={45}
                  min={18}
                  onValuesChange={(ageValues) => this.setState({ageValues})}
                  onValuesChangeFinish={(ageValues) => {
                    return updateAgePreference({variables: {id, minAgePreference: ageValues[0], maxAgePreference:ageValues[1]}})}
                  }
                />
              )
            }}
          </Mutation>
        </View>
      </View>
    </Card>
    <Card>
      <View style={styles.sliderContainer}>
        <View style={styles.titleSlider}>
          <Text>Search Distance</Text>
          <Text>{distance}</Text>
        </View>
        <View>
          <Mutation mutation={SET_DISTANCE}>
            {(updateDistance, { data }) => {
              return (
                <Slider 
                  step={1}
                  value={distance}
                  maximumValue={50}
                  minimumValue={0}
                  disabled={false}
                  onValueChange={(distance) => this.setState({distance})}
                  onSlidingComplete={(distance) => {
                    console.log('distance (server): ',distance);
                    return updateDistance({variables: {id, distance}})
                  }}
                />
              )
              }
            }
          </Mutation>
        </View>    
      </View>
    </Card>
    {!this.props.hideNotifications && 
      <Card>
        <View style={styles.titleSlider}>
          <Text>Send Notifications</Text> 
          <Mutation mutation={SET_NOTIFICATIONS}>
            {(updateSendNotifications, { data }) => {
              return (
                <Switch 
                  onValueChange={() => {
                    const newSendNotifications = !sendNotifications;
                    updateSendNotifications({
                      variables: {
                          id, 
                          sendNotifications: newSendNotifications
                      },
                      update: (store, data) => {
                        console.log('data: ',data);
                        let storeData = store.readFragment({
                          id: `${id}q`,
                          fragment: gql`
                            fragment Queue on Queue {
                              list
                              cursor
                              id
                            }
                          `,
                        });
                        store.writeFragment({
                          id:  `${id}q`,
                          fragment: gql`
                            fragment Queue on Queue {
                              list 
                              cursor 
                              id
                            }
                          `,
                          data: {
                            ...storeData,
                            list: data.data.editUserQueue.list,
                            cursor: data.data.editUserQueue.cursor,
                          }
                        })
                      }
                      })
                    this.notificationChange();
                  }}
                  value={sendNotifications}
                />
              )}}
          </Mutation>
        </View>
      </Card>
    }
  </View>
  )}
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    display:'flex',
    justifyContent: 'flex-start',
    padding: 10,
  },
  titleSlider: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  sliderContainer: {
    minHeight: 50,
    justifyContent: 'flex-start',
  },
  markerStyle: {
    height: 12,
    width: 12,
    borderRadius: 12
  }
})

export default EditSettings;