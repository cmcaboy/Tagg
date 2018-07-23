import React,{Component} from 'react';
import {Text,View,Slider,Switch,StyleSheet,Dimensions} from 'react-native';
import {Picker} from 'native-base';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {Card,Button} from './common';
import { PRIMARY_COLOR } from '../variables';
import { db } from '../firebase';
import { testFemale, testMale } from '../tests/testUser';
import uuid from 'uuid';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import {GET_SETTINGS} from '../apollo/queries';
import {updateQueue,updateDistance} from '../apollo/local/queries/cache';
//import RNPickerSelect from 'react-native-picker-select';
import {
  SET_AGE_PREFERENCE,
  SET_DISTANCE,
  SET_NOTIFICATIONS,
  SET_FOLLOWER_DISPLAY} from '../apollo/mutations';
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

const followerDisplayItems = [
  {
    label: 'Following Only',
    value: 'Following Only',
  },
  {
    label: 'Non-Following Only',
    value: 'Non-Following Only',
  },
  {
    label: 'Both',
    value: 'Both',
  },
]

class EditSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ageValues: [this.props.minAgePreference,this.props.maxAgePreference],
      distance: this.props.distance,
      sendNotifications: this.props.sendNotifications,
      followerDisplay: this.props.followerDisplay,
    } 
  }
    
  notificationChange = () => {
    this.setState((prevState) => ({sendNotifications:!prevState.sendNotifications}))
    console.log(this.state.sendNotifications);
  }

  render() {
    const {ageValues,distance,sendNotifications,followerDisplay} = this.state;
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
                    return updateAgePreference({
                      variables: {id, minAgePreference: ageValues[0], maxAgePreference:ageValues[1]},
                      optimisticResponse: {
                        __typename: 'Mutation',
                        editUser: {
                          id,
                          minAgePreference: ageValues[0],
                          maxAgePreference: ageValues[1],
                          __typename: 'User'
                        }
                      },
                      update: (store,data) => {
                        const fragment = gql`
                            fragment updateAgePreference on User {
                                minAgePreference
                                maxAgePreference
                        }
                        `;
                        let storeData = store.readFragment({
                            id: data.data.editUser.id,
                            fragment: fragment,
                        });

                        store.writeFragment({
                            id: data.data.editUser.id,
                            fragment: fragment,
                            data: {
                                ...storeData,
                                minAgePreference: data.data.editUser.minAgePreference,
                                maxAgePreference: data.data.editUser.maxAgePreference,
                            }
                        })
                      }
                    })}
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
                  minimumValue={1}
                  disabled={false}
                  onValueChange={(distance) => this.setState({distance})}
                  onSlidingComplete={(distance) => {
                    console.log('distance (server): ',distance);
                    return updateDistance({
                      variables: {id, distance},
                      optimisticResponse: {
                        __typename: 'Mutation',
                        editUser: {
                          id,
                          distance,
                          __typename: 'User'
                        }
                      },
                      //update: (store,data) => updateQueue(store,data)
                      update: (store,data) => {
                        console.log('store: ',store);
                        console.log('data: ',data);
                        const fragment = gql`
                            fragment updateDistance on User {
                                distance
                        }
                        `;
                        let storeData = store.readFragment({
                            id: data.data.editUser.id,
                            fragment: fragment,
                        });

                        console.log('storeData: ',storeData);
                        store.writeFragment({
                            id: data.data.editUser.id,
                            fragment: fragment,
                            data: {
                                ...storeData,
                                distance: data.data.editUser.distance,
                            }
                        })
                      },
                    })
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
                      optimisticResponse: {
                        __typename: 'Mutation',
                        editUser: {
                          id,
                          sendNotifications: newSendNotifications,
                          __typename: 'User'
                        }
                      },
                      update: (store, data) => {
                        const fragment = gql`
                            fragment updateNotifications on User {
                                sendNotifications
                        }
                        `;
                        let storeData = store.readFragment({
                            id: data.data.editUser.id,
                            fragment: fragment,
                        });

                        store.writeFragment({
                            id: data.data.editUser.id,
                            fragment: fragment,
                            data: {
                                ...storeData,
                                sendNotifications: data.data.editUser.sendNotifications,
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
    <Card>
        <View style={styles.titleSlider}>
          
          <Mutation mutation={SET_FOLLOWER_DISPLAY}>
            {(changeFollowerDisplay, { data }) => {
              return (
                <Picker
                  //placeholder={{label: this.props.followerDisplay,value:this.props.followerDisplay}} 
                  mode='dropdown'
                  selectedValue={this.state.followerDisplay}
                  onValueChange={(newFollowerDisplay) => {
                    console.log('newFollowerDisplay: ',newFollowerDisplay);
                    changeFollowerDisplay({
                      variables: {
                          id, 
                          followerDisplay: newFollowerDisplay,
                      },
                      optimisticResponse: {
                        __typename: 'Mutation',
                        editUser: {
                          id,
                          followerDisplay: newFollowerDisplay,
                          __typename: 'User'
                        }
                      },
                      update: (store, data) => {
                        console.log('store: ',store);
                        
                        console.log('data: ',data);
                        const fragment = gql`
                            fragment updateFollowerDisplay on User {
                                followerDisplay
                        }
                        `;
                        let storeData = store.readFragment({
                            id: data.data.editUser.id,
                            fragment: fragment,
                        });

                        console.log('storeData: ',storeData);
                        store.writeFragment({
                            id: data.data.editUser.id,
                            fragment: fragment,
                            data: {
                                ...storeData,
                                followerDisplay: data.data.editUser.followerDisplay,
                            }
                        })
                        console.log('store: ',store);
                        this.setState({followerDisplay:data.data.editUser.followerDisplay})
                      }
                      })
                  }}
                >
                  <Picker.Item label="Following Only" value="Following Only"/>
                  <Picker.Item label="Non-Following Only" value="Non-Following Only"/>
                  <Picker.Item label="Both" value="Both"/>
                </Picker>
              )}}
          </Mutation>
        </View>
      </Card>
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