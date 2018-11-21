import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button, Text } from 'native-base';
import { MyAppText } from './MyAppText';
import { Spinner } from './Spinner';
import LogoutButton from '../LogoutButton';

const SCREEN_WIDTH = Dimensions.get('window').width;

class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  attemptRefresh = async () => {
    this.setState({ loading: true });
    await this.props.refetch();
    this.setState({ loading: false });
  };

  refreshButton = () => {
    const { refetch = null } = this.props;
    if (!refetch) return null;

    if (this.state.loading) {
      return <Spinner />;
    }
    return (
      <Button block onPress={this.attemptRefresh} style={styles.refreshButton}>
        <Text>Refresh</Text>
      </Button>
    );
  };

  render() {
    const { error } = this.props;
    const { errorStyle } = styles;
    return (
      <View style={errorStyle}>
        <Ionicons name="md-sad" size={100} color="black" />
        <MyAppText>{`Whoops! Something with wrong: ${error}`}</MyAppText>
        {this.refreshButton()}
        <LogoutButton />
      </View>
    );
  }
}
// const ErrorMessage = ({ error, refetch = null }) => (

const styles = StyleSheet.create({
  errorStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 30,
  },
  refreshButton: {
    marginTop: 20,
    marginBottom: 15,
  },
  noProspectsButton: {
    width: SCREEN_WIDTH * 0.7,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007aff',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
  },
  noProspectsText: {},
});

export { ErrorMessage };