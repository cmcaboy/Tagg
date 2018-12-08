import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { CardSection, ActionIcon } from './index';

interface Props {
  lowerCaseOnly?: boolean;
  updateValue: (any: any) => any;
  value: string | number | string[];
  multiline?: boolean;
  secureTextEntry?: boolean;
  field: string;
}
interface State {
  isEdit: boolean;
  value: string | number | string[];
  lowerCaseOnly: boolean;
}

class CondInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { value, lowerCaseOnly = false } = this.props;
    this.state = {
      isEdit: false,
      value,
      lowerCaseOnly,
    };
  }

  confirmUpdate = () => {
    const { updateValue } = this.props;
    const { value } = this.state;
    updateValue(value);
    this.setState({ isEdit: false });
  };

  onChangeText = (v: string) => {
    if (this.state.lowerCaseOnly) {
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
            <CardSection style={styles.cardSection as ViewStyle}>
              <Text style={value ? styles.field : styles.blankField}>{value || field}</Text>
            </CardSection>
          </TouchableOpacity>
        ) : (
          <CardSection style={styles.cardSection as ViewStyle}>
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
                style={styles.checkMarker as ViewStyle}
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

interface Style {
  container: ViewStyle;
  blankField: TextStyle;
  field: TextStyle;
  editView: ViewStyle;
  textInputStyle: TextStyle;
  checkMarker: ViewStyle;
  cardSection: ViewStyle;
}
const styles = StyleSheet.create<Style>({
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
