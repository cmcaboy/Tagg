import React, { Component } from 'react';
import {
  Text, View, Slider, Switch, StyleSheet, ViewStyle,
} from 'react-native';
import { Picker } from 'native-base';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, MyAppText } from './common';
import {
  SET_AGE_PREFERENCE,
  SET_DISTANCE,
  SET_NOTIFICATIONS,
  SET_FOLLOWER_DISPLAY,
  SET_VIEW_OBJECTIONABLE,
} from '../apollo/mutations';
import { SCREEN_WIDTH } from '../variables';
import { setAgePreference, setAgePreferenceVariables } from '../apollo/mutations/__generated__/setAgePreference';
import { setDistance, setDistanceVariables } from '../apollo/mutations/__generated__/setDistance';
import { setFollowerDisplayVariables, setFollowerDisplay } from '../apollo/mutations/__generated__/setFollowerDisplay';
import { setNotifications, setNotificationsVariables } from '../apollo/mutations/__generated__/setNotifications';
import { setViewObjectionable, setViewObjectionableVariables } from '../apollo/mutations/__generated__/setViewObjectionable';

const SLIDER_WIDTH = SCREEN_WIDTH * 0.85;

interface Props {
  minAgePreference: number;
  maxAgePreference: number;
  distance: number;
  sendNotifications: boolean;
  id: string;
  followerDisplay: string;
  hideNotifications: boolean;
  viewObjectionable: boolean;
}

interface State {
  ageValues: number[];
  distance: number;
  sendNotifications: boolean;
  followerDisplay: string;
  viewObjectionable: boolean;
}

class SetAgePreference extends Mutation<setAgePreference, setAgePreferenceVariables> {};
class SetDistance extends Mutation<setDistance, setDistanceVariables> {};
class SetFollowerDisplay extends Mutation<setFollowerDisplay, setFollowerDisplayVariables> {};
class SetNotifications extends Mutation<setNotifications, setNotificationsVariables> {};
class SetViewObjectionable extends Mutation<setViewObjectionable, setViewObjectionableVariables> {};

class EditSettings extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const {
      minAgePreference,
      maxAgePreference,
      distance,
      sendNotifications,
      followerDisplay,
      viewObjectionable,
    } = this.props;

    this.state = {
      distance,
      sendNotifications,
      ageValues: [minAgePreference, maxAgePreference],
      followerDisplay: followerDisplay || 'Both', // Set to 'Both' by deafult
      viewObjectionable: viewObjectionable || true, // Set to true by default
    };
  }

  notificationChange = () => {
    this.setState(prevState => ({ sendNotifications: !prevState.sendNotifications }));
  };

  render() {
    const {
      ageValues, distance, sendNotifications, followerDisplay, viewObjectionable,
    } = this.state;
    const { id, hideNotifications } = this.props;
    return (
      <View style={styles.containerStyle}>
        <Card>
          <View style={styles.sliderContainer}>
            <View style={styles.titleSlider}>
              <Text>Age Preference </Text>
              <Text>{`${ageValues[0]} - ${ageValues[1]}`}</Text>
            </View>
            <View style={{ paddingTop: 20, width: SLIDER_WIDTH }}>
              <SetAgePreference mutation={SET_AGE_PREFERENCE}>
                {updateAgePreference => (
                  <MultiSlider
                    containerStyle={{ height: 12 }}
                    markerOffsetX={0}
                    sliderLength={hideNotifications ? SLIDER_WIDTH * 0.7 : SLIDER_WIDTH}
                    markerStyle={styles.markerStyle as ViewStyle}
                    step={1}
                    values={ageValues}
                    max={45}
                    min={18}
                    onValuesChange={av => this.setState({ ageValues: av })}
                    onValuesChangeFinish={av => updateAgePreference({
                      variables: { id, minAgePreference: av[0], maxAgePreference: av[1] },
                      optimisticResponse: {
                        // __typename: 'Mutation',
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
                          fragment,
                          id: data.data.editUser.id,
                        });

                        store.writeFragment({
                          fragment,
                          id: data.data.editUser.id,
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
                )}
              </SetAgePreference>
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
              <SetDistance mutation={SET_DISTANCE}>
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
                        // __typename: 'Mutation',
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
                          fragment,
                          id: data.data.editUser.id,
                        });

                        console.log('storeData: ', storeData);
                        store.writeFragment({
                          fragment,
                          id: data.data.editUser.id,
                          data: {
                            ...storeData,
                            distance: data.data.editUser.distance,
                          },
                        });
                      },
                    })
                    }
                  />
                )}
              </SetDistance>
            </View>
          </View>
        </Card>
        {!hideNotifications && (
          <Card>
            <View style={styles.titleSlider}>
              <Text>Send Notifications</Text>
              <SetNotifications mutation={SET_NOTIFICATIONS}>
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
                          // __typename: 'Mutation',
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
                            fragment,
                            id: data.data.editUser.id,
                          });

                          store.writeFragment({
                            fragment,
                            id: data.data.editUser.id,
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
              </SetNotifications>
            </View>
          </Card>
        )}
        <Card>
          <View style={styles.titleSlider}>
            <MyAppText>Display Category</MyAppText>
            <SetFollowerDisplay mutation={SET_FOLLOWER_DISPLAY}>
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
                        // __typename: 'Mutation',
                        editUser: {
                          id,
                          followerDisplay: newFollowerDisplay,
                          __typename: 'User',
                        },
                      },
                      update: (store, data) => {
                        // I could also update the user queue with the updated settings
                        console.log('store: ', store);

                        console.log('data: ', data);
                        const fragment = gql`
                          fragment updateFollowerDisplay on User {
                            followerDisplay
                          }
                        `;
                        const storeData = store.readFragment({
                          fragment,
                          id: data.data.editUser.id,
                        });

                        console.log('storeData: ', storeData);
                        store.writeFragment({
                          fragment,
                          id: data.data.editUser.id,
                          data: {
                            ...storeData,
                            followerDisplay: data.data.editUser.followerDisplay,
                          },
                        });
                        console.log('store: ', store);
                        this.setState({ followerDisplay: data.data.editUser.followerDisplay });
                      },
                    });
                  }}
                >
                  <Picker.Item label="Following Only" value="Following Only" />
                  <Picker.Item label="Non-Following Only" value="Non-Following Only" />
                  <Picker.Item label="Both" value="Both" />
                </Picker>
              )}
            </SetFollowerDisplay>
          </View>
        </Card>
        <Card>
          <View style={styles.titleSlider}>
            <MyAppText>View Objectionable Content</MyAppText>
            <SetViewObjectionable mutation={SET_VIEW_OBJECTIONABLE}>
              {changeViewObjectionable => (
                <Picker
                  // placeholder={{ label: this.props.followerDisplay, value: this.props.followerDisplay }}
                  mode="dropdown"
                  selectedValue={viewObjectionable}
                  onValueChange={(newViewObjectionable) => {
                    console.log('newViewObjectionable: ', newViewObjectionable);
                    changeViewObjectionable({
                      variables: {
                        id,
                        viewObjectionable: newViewObjectionable,
                      },
                      optimisticResponse: {
                        // __typename: 'Mutation',
                        editUser: {
                          id,
                          viewObjectionable: newViewObjectionable,
                          __typename: 'User',
                        },
                      },
                      update: (store, data) => {
                        // I could also update the user queue with the updated settings
                        console.log('store: ', store);

                        console.log('data: ', data);
                        const fragment = gql`
                          fragment updateViewObjectionable on User {
                            viewObjectionable
                          }
                        `;
                        const storeData = store.readFragment({
                          fragment,
                          id: data.data.editUser.id,
                        });

                        console.log('storeData: ', storeData);
                        store.writeFragment({
                          fragment,
                          id: data.data.editUser.id,
                          data: {
                            ...storeData,
                            viewObjectionable: data.data.editUser.viewObjectionable,
                          },
                        });
                        console.log('store: ', store);
                        this.setState({ viewObjectionable: data.data.editUser.viewObjectionable });
                      },
                    });
                  }}
                >
                  <Picker.Item label="Yes" value={ true } />
                  <Picker.Item label="No" value={ false } />
                </Picker>
              )}
            </SetViewObjectionable>
          </View>
        </Card>
      </View>
    );
  }
}

interface Style {
  containerStyle: ViewStyle;
  titleSlider: ViewStyle;
  sliderContainer: ViewStyle;
  markerStyle: ViewStyle;
}

const styles = StyleSheet.create<Style>({
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
