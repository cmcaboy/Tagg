import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
} from 'react-native';
import { CardSection, ActionIcon } from './index';

class CondInput extends Component {
  constructor(props) {
    super(props);
    const { value, lowerCaseOnly } = this.props;
    this.state = {
      isEdit: false,
      value,
    };

    this.lowerCaseOnly = lowerCaseOnly;
  }

  confirmUpdate = () => {
    const { updateValue } = this.props;
    const { value } = this.state;
    updateValue(value);
    this.setState({ isEdit: false });
  };

  onChangeText = (v) => {
    if (this.lowerCaseOnly) {
      this.setState({ value: v.toLowerCase() });
    } else {
      this.setState({ value: v });
    }
  };

  enableEditMode = () => this.setState({ isEdit: true });

  render() {
    const { isEdit, value } = this.state;
    const { field, multiline = false, secureTextEntry = false } = this.props;
    return (
      <View style={styles.container}>
        {!isEdit ? (
          <TouchableOpacity onPress={this.enableEditMode}>
            <CardSection style={styles.cardSection}>
              <Text style={value ? styles.field : styles.blankField}>{value || field}</Text>
            </CardSection>
          </TouchableOpacity>
        ) : (
          <CardSection style={styles.cardSection}>
            <View style={styles.editView}>
              <TextInput
                secureTextEntry={secureTextEntry}
                selectTextOnFocus
                autoFocus
                style={styles.textInputStyle}
                onChangeText={this.onChangeText}
                value={`${value}`}
                multiline={multiline}
                onEndEditing={() => this.confirmUpdate()}
              />
              <ActionIcon
                onPress={() => this.confirmUpdate()}
                name="done"
                size={32}
                color="green"
                style={styles.checkMarker}
              />
              {/*
                <Button
                onPress={() => this.confirmUpdate()}
                >Save</Button>
              */}
            </View>
          </CardSection>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blankField: {
    opacity: 0.6,
  },
  field: {
    opacity: 1.0,
  },
  editView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInputStyle: {
    height: 40,
    flex: 6,
    borderColor: 'gray',
    borderWidth: 0,
  },
  checkMarker: {
    flex: 1,
  },
  cardSection: {
    minHeight: 40,
    alignItems: 'center',
  },
});

export { CondInput };
