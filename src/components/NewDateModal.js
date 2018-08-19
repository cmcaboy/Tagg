import React from "react";
import { View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from "react-native-datepicker";
import { Mutation } from "react-apollo";
import { Button } from "native-base";
import { MyAppText, HorizontalLine, MyTitleText, MyAppModal } from "./common";
import { DATE_FORMAT, convertDateToEpoch } from "../format";
import toastMessage from "../services/toastMessage";
import { NEW_DATE } from "../apollo/mutations";

class NewDateModal extends React.Component {
  constructor(props) {
    super(props);

    this.blankState = {
      time: "",
      date: "",
      location: "",
      description: "",
      datetime: ""
    };

    this.state = this.blankState;
  }

  closeModal = () => {
    const { isVisible, flipNewDateModal } = this.props;
    if (isVisible) {
      flipNewDateModal();
    }
    this.setState(this.blankState);
  };

  render() {
    const { id, isVisible } = this.props;
    const { datetime, description } = this.state;
    return (
      <MyAppModal isVisible={isVisible} close={this.closeModal}>
        <MyTitleText>{"New Date Request"}</MyTitleText>
        <HorizontalLine />
        <View style={{ alignItems: "stretch" }}>
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
            <Mutation mutation={NEW_DATE}>
              {newDate => (
                <Button
                  block
                  onPress={() => {
                    this.closeModal();
                    console.log(
                      "datetimeOfDate Epoch: ",
                      convertDateToEpoch(datetime)
                    );
                    return newDate({
                      variables: {
                        id,
                        datetimeOfDate: convertDateToEpoch(datetime),
                        description
                      },
                      update: (store, data) => {
                        console.log("data from newDate mutation: ", data);
                        console.log("store: ", store);
                        toastMessage({
                          text: "Your date request has been created!"
                        });
                      }
                    });
                  }}
                >
                  <MyAppText
                    style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}
                  >
                    {"Submit"}
                  </MyAppText>
                </Button>
              )}
            </Mutation>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={this.closeModal}
            >
              <MyAppText style={styles.cancelText}>{"Cancel"}</MyAppText>
            </TouchableOpacity>
          </View>
        </View>
      </MyAppModal>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    height: 75,
    textAlign: "center",
    marginBottom: 10,
    borderRadius: 2
  },
  dateInput: {
    width: "100%",
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 2
    // textAlign: 'left',
  },
  buttonView: {
    flexDirection: "column",
    justifyContent: "space-around"
  },
  cancelText: {
    textAlign: "center",
    fontSize: 16
  },
  cancelButton: {
    marginVertical: 15
  }
});

export default NewDateModal;
