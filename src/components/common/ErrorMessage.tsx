import React from 'react';
import {
  StyleSheet, Dimensions, ViewStyle, TextStyle, ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button, Text } from 'native-base';
import { MyAppText } from './MyAppText';
import { Spinner } from './Spinner';
import LogoutButton from '../LogoutButton';
import { analytics } from '../../firebase';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  refetch?: () => any | null;
  error: string;
}
interface State {
  loading: boolean;
}

class ErrorMessage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount = () => {
    const { error } = this.props;
    analytics.logEvent(`Error__${error}`.substring(0, 31));
  };

  attemptRefresh = async () => {
    analytics.logEvent('Click_errorMes_refreshBtn');
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
      <Button block onPress={this.attemptRefresh} style={styles.refreshButton as ViewStyle}>
        <Text>Refresh</Text>
      </Button>
    );
  };

  render() {
    const { error } = this.props;
    const { errorStyle } = styles;
    return (
      <ScrollView contentContainerStyle={errorStyle}>
        <Ionicons name="md-sad" size={100} color="black" />
        <MyAppText>{`Whoops! Something with wrong: ${error}`}</MyAppText>
        {this.refreshButton()}
        <LogoutButton />
      </ScrollView>
    );
  }
}
// const ErrorMessage = ({ error, refetch = null }) => (

interface Style {
  errorStyle: ViewStyle;
  refreshButton: ViewStyle;
  noProspectsButton: ViewStyle;
  noProspectsText: TextStyle;
}
const styles = StyleSheet.create<Style>({
  errorStyle: {
    // flex: 1,
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
