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

  setError = (error: string) => this.setState({ error });

  closeModal = () => {
    const { isVisible, flipNewDateModal } = this.props;
    if (isVisible) {
      flipNewDateModal();
    }
    this.setState(this.blankState);
  };

  onCompleted = (data: any) => {
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
                          update: (store, data) => {
                            // console.log('data from newDate mutation: ', data);
                            // console.log('store: ', store);
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
              <TouchableOpacity style={styles.cancelButton} onPress={this.closeModal}>
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
