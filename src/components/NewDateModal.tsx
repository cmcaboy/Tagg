import React from 'react';
import {
  View, TouchableOpacity, StyleSheet, TextInput, TextStyle, ViewStyle,
} from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-datepicker';
import { Mutation } from 'react-apollo';
import { Button } from 'native-base';
import { ApolloError } from 'apollo-client';
import {
  MyAppText, HorizontalLine, MyTitleText, MyAppModal, Spinner,
} from './common';
import { DATE_FORMAT, convertDateToEpoch } from '../format';
import toastMessage from '../services/toastMessage';
import { NEW_DATE } from '../apollo/mutations';
import { createDate, createDateVariables } from '../apollo/mutations/__generated__/createDate';
import { GET_MATCHES } from '../apollo/queries';
import { analytics } from '../firebase';

interface Props {
  isVisible: boolean;
  flipNewDateModal: () => void;
  id: string;
}

interface State {
  time: string;
  date: string;
  location: string;
  description: string;
  datetime: string;
  buttonDisabled: boolean;
  error: string;
}

class NewDate extends Mutation<createDate, createDateVariables> {}

class NewDateModal extends React.Component<Props, State> {
  public blankState: State = {
    time: '',
    date: '',
    location: '',
    description: '',
    datetime: '',
    buttonDisabled: false,
    error: '',
  };

  constructor(props: Props) {
    super(props);

    this.state = this.blankState;
  }

  componentDidMount = () => {
    analytics.setCurrentScreen('New Date Modal');
    analytics.logEvent('Page_New_Date_Modal');
  }

  setError = (error: string) => {
    analytics.logEvent(`Error_NewDateModal_${error}`);
    this.setState({ error });
  }

  cancel = () => {
    analytics.logEvent('Click_NewDateModal_cancel');
    this.closeModal();
  }

  closeModal = () => {
    const { isVisible, flipNewDateModal } = this.props;
    if (isVisible) {
      flipNewDateModal();
    }
    this.setState(this.blankState);
  };

  onCompleted = (data: any) => {
    analytics.logEvent(`Event_newDateCreated`);
    toastMessage({
      text: 'Your date request has been created!',
      duration: 3000,
      position: 'top',
    });
    this.closeModal();
  };

  onError = (error: ApolloError) => {
    console.log('error: ', error);
    this.setError(error.message);
    analytics.logEvent(`Error_NewDateModal_${error}`);
  };

  validateForm = () => {
    if (!this.state.datetime) {
      this.setError('Please select a date/time for your date');
      return false;
    }
    if (!this.state.description) {
      this.setError(
        'Please provide a description so that others know what kind of date your are looking for!',
      );
      return false;
    }
    analytics.logEvent('Event_NewDateModal_Validation_Successful')
    return true; // all tests pass
  };

  render() {
    const { id, isVisible } = this.props;
    const { datetime, description } = this.state;
    return (
      <MyAppModal isVisible={isVisible} close={this.closeModal}>
        <MyTitleText>New Date Request</MyTitleText>
        <HorizontalLine />
        <View style={{ alignItems: 'stretch' }}>
          <DatePicker
            style={styles.dateInput}
            mode="datetime"
            date={datetime}
            format={DATE_FORMAT}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={d => this.setState({ datetime: d })}
            placeholder="When will this date take place?"
          />
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="What kind of date are you looking for?"
            onChangeText={text => this.setState({ description: text })}
            value={description}
            maxLength={300}
          />
          <View style={styles.buttonView}>
            {!!this.state.error && (
              <MyAppText style={styles.errorTextStyle}>{this.state.error}</MyAppText>
            )}
            <NewDate mutation={NEW_DATE} onCompleted={this.onCompleted} onError={this.onError}>
              {(newDate, { loading }) => {
                if (loading) {
                  return <Spinner />;
                }
                return (
                  <Button
                    accessible={false}
                    block
                    onPress={() => {
                      // console.log('button press');
                      // console.log('datetime: ', datetime);
                      // console.log('datetimeOfDate Epoch: ', convertDateToEpoch(datetime));
                      if (!this.validateForm()) {
                        return;
                      }

                      this.setError('');

                      return newDate({
                        variables: {
                          id,
                          description,
                          datetimeOfDate: convertDateToEpoch(datetime),
                        },
                        update: (store, newData) => {
                          // Update the new date in the cache
                          // Do I need an optimistic response?

                          console.log('data from newDate mutation: ', newData);
                          console.log('store: ', store);

                          // grab matches query in local cache
                          const {
                            user,
                            user: {
                              // matchedDates,
                              dateRequests,
                              dateRequests: { list: dateList },
                            },
                          } = store.readQuery({ query: GET_MATCHES });
                          // console.log('user: ', user);

                          const newList = [
                            ...dateList,
                            newData.data.createDate,
                          ].sort((a, b) => a.datetimeOfDate - b.datetimeOfDate);

                          store.writeQuery({
                            query: GET_MATCHES,
                            data: {
                              user: {
                                ...user,
                                dateRequests: {
                                  ...dateRequests,
                                  list: newList,
                                },
                              },
                            },
                          });
                        },
                      });
                    }}
                  >
                    <MyAppText style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>
                      {'Submit'}
                    </MyAppText>
                  </Button>
                );
              }}
            </NewDate>
            <TouchableOpacity style={styles.cancelButton} onPress={this.cancel}>
              <MyAppText style={styles.cancelText}>Cancel</MyAppText>
            </TouchableOpacity>
          </View>
        </View>
      </MyAppModal>
    );
  }
}

interface Style {
  textInput: TextStyle;
  dateInput: TextStyle;
  buttonView: ViewStyle;
  cancelText: TextStyle;
  cancelButton: ViewStyle;
  errorTextStyle: TextStyle;
}

const styles = StyleSheet.create<Style>({
  textInput: {
    borderWidth: 1,
    height: 75,
    textAlign: 'center',
    marginBottom: 10,
    borderRadius: 2,
  },
  dateInput: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 2,
    // textAlign: 'left',
  },
  buttonView: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  cancelText: {
    textAlign: 'center',
    fontSize: 16,
  },
  cancelButton: {
    marginVertical: 15,
  },
  errorTextStyle: {
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    color: 'red',
    marginTop: 15,
  },
});

export default NewDateModal;
