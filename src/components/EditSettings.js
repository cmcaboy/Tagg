import React, { Component } from 'react';
import { Text, View, Slider, Switch, StyleSheet, Dimensions } from 'react-native';
import { Picker } from 'native-base';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Card } from './common';
// import RNPickerSelect from 'react-native-picker-select';
import {
  SET_AGE_PREFERENCE,
  SET_DISTANCE,
  SET_NOTIFICATIONS,
  SET_FOLLOWER_DISPLAY,
} from '../apollo/mutations';

const SLIDER_WIDTH = Dimensions.get('window').width * 0.85;

class EditSettings extends Component {
  constructor(props) {
    super(props);

    const {
      minAgePreference,
      maxAgePreference,
      distance,
      sendNotifications,
      followerDisplay,
    } = this.props;

    this.state = {
      ageValues: [minAgePreference, maxAgePreference],
      distance,
      sendNotifications,
      followerDisplay: followerDisplay ? followerDisplay : 'Both',
    };
  }

  notificationChange = () => {
    this.setState(prevState => ({ sendNotifications: !prevState.sendNotifications }));
  }

  render() {
    const { ageValues, distance, sendNotifications, followerDisplay } = this.state;
    const { id, hideNotifications } = this.props;
  return (
    <View style={styles.containerStyle}>
    <Card>
      <View style={styles.sliderContainer}>
        <View style={styles.titleSlider}>
          <Text>
            {'Age Preference '}
          </Text>
          <Text>
            {`${ageValues[0]} - ${ageValues[1]}`}
          </Text>
        </View>
        <View style={{ paddingTop: 20, width: SLIDER_WIDTH }}>
          <Mutation mutation={SET_AGE_PREFERENCE}>
            {updateAgePreference => (
              <MultiSlider
                containerStyle={{ height: 12 }}
                markerOffsetX={0}
                sliderLength={hideNotifications ? (SLIDER_WIDTH * 0.70) : SLIDER_WIDTH}
                markerStyle={styles.markerStyle}
                step={1}
                values={ageValues}
                max={45}
                min={18}
                onValuesChange={av => this.setState({ ageValues: av })}
                onValuesChangeFinish={av => updateAgePreference({
                  variables: { id, minAgePreference: av[0], maxAgePreference: av[1] },
                  optimisticResponse: {
                    __typename: 'Mutation',
                    editUser: {
                      id,
                      minAgePreference: av[0],
                      maxAgePreference: av[1],
                      __typename: 'User',
                    },
                  },
                  update: (store, data) => {
                    const fragment = gql`
                        fragment updateAgePreference on User {
                            minAgePreference
                            maxAgePreference
                    }
                    `;
                    const storeData = store.readFragment({
                      id: data.data.editUser.id,
                      fragment,
                    });

                    store.writeFragment({
                      id: data.data.editUser.id,
                      fragment,
                      data: {
                        ...storeData,
                        minAgePreference: data.data.editUser.minAgePreference,
                        maxAgePreference: data.data.editUser.maxAgePreference,
                      },
                    });
                  },
                })
                }
              />
            )
            }
          </Mutation>
        </View>
      </View>
    </Card>
    <Card>
      <View style={styles.sliderContainer}>
        <View style={styles.titleSlider}>
          <Text>
            {'Search Distance'}
          </Text>
          <Text>
            {distance}
          </Text>
        </View>
        <View>
          <Mutation mutation={SET_DISTANCE}>
            {updateDistance => (
              <Slider
                step={1}
                value={distance}
                maximumValue={50}
                minimumValue={1}
                disabled={false}
                onValueChange={d => this.setState({ distance: d })}
                onSlidingComplete={d => updateDistance({
                  variables: { id, distance: d },
                  optimisticResponse: {
                    __typename: 'Mutation',
                    editUser: {
                      id,
                      distance: d,
                      __typename: 'User',
                    },
                  },
                  // update: (store,data) => updateQueue(store,data)
                  update: (store, data) => {
                    console.log('store: ', store);
                    console.log('data: ', data);
                    const fragment = gql`
                      fragment updateDistance on User {
                        distance
                    }
                    `;
                    const storeData = store.readFragment({
                      id: data.data.editUser.id,
                      fragment,
                    });

                    console.log('storeData: ', storeData);
                    store.writeFragment({
                      id: data.data.editUser.id,
                      fragment,
                      data: {
                        ...storeData,
                        distance: data.data.editUser.distance,
                      },
                    });
                  },
                })
                }
              />
            )
            }
          </Mutation>
        </View>
      </View>
    </Card>
      {!hideNotifications && (
        <Card>
          <View style={styles.titleSlider}>
            <Text>
              {'Send Notifications'}
            </Text>
            <Mutation mutation={SET_NOTIFICATIONS}>
              {updateSendNotifications => (
                <Switch
                  onValueChange={() => {
                    const newSendNotifications = !sendNotifications;
                    updateSendNotifications({
                      variables: {
                        id,
                        sendNotifications: newSendNotifications,
                      },
                      optimisticResponse: {
                        __typename: 'Mutation',
                        editUser: {
                          id,
                          sendNotifications: newSendNotifications,
                          __typename: 'User',
                        },
                      },
                      update: (store, data) => {
                        const fragment = gql`
                            fragment updateNotifications on User {
                                sendNotifications
                        }
                        `;
                        const storeData = store.readFragment({
                          id: data.data.editUser.id,
                          fragment,
                        });

                        store.writeFragment({
                          id: data.data.editUser.id,
                          fragment,
                          data: {
                            ...storeData,
                            sendNotifications: data.data.editUser.sendNotifications,
                          },
                        });
                      },
                    });
                    this.notificationChange();
                  }}
                  value={sendNotifications}
                />
              )}
            </Mutation>
          </View>
        </Card>
      )
      }
      <Card>
        <View style={styles.titleSlider}>
          <Mutation mutation={SET_FOLLOWER_DISPLAY}>
            {changeFollowerDisplay => (
              <Picker
                // placeholder={{ label: this.props.followerDisplay, value: this.props.followerDisplay }} 
                mode="dropdown"
                selectedValue={followerDisplay}
                onValueChange={(newFollowerDisplay) => {
                  console.log('newFollowerDisplay: ', newFollowerDisplay);
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
                        __typename: 'User',
                      }
                    },
                    update: (store, data) => {
                      console.log('store: ', store);
                      
                      console.log('data: ', data);
                      const fragment = gql`
                          fragment updateFollowerDisplay on User {
                              followerDisplay
                      }
                      `;
                      const storeData = store.readFragment({
                        id: data.data.editUser.id,
                        fragment,
                      });

                      console.log('storeData: ', storeData);
                      store.writeFragment({
                        id: data.data.editUser.id,
                        fragment,
                        data: {
                          ...storeData,
                          followerDisplay: data.data.editUser.followerDisplay,
                        },
                      });
                      console.log('store: ', store);
                      this.setState({followerDisplay: data.data.editUser.followerDisplay });
                    },
                  });
                }}
              >
                <Picker.Item label="Following Only" value="Following Only" />
                <Picker.Item label="Non-Following Only" value="Non-Following Only" />
                <Picker.Item label="Both" value="Both" />
              </Picker>
            )
            }
          </Mutation>
        </View>
      </Card>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    padding: 10,
  },
  titleSlider: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  sliderContainer: {
    minHeight: 50,
    justifyContent: 'flex-start',
  },
  markerStyle: {
    height: 12,
    width: 12,
    borderRadius: 12,
  },
});

export default EditSettings;
