import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { YellowBox, AsyncStorage } from 'react-native';
import { Sentry } from 'react-native-sentry';
import { Root } from 'native-base';
import codePush from 'react-native-code-push';
import ApolloClient from 'apollo-client';
import Authentication from './components/Authentication';
import { client } from './apollo';
import { Spinner } from './components/common';

Sentry.config('https://5bbde6be977141f6b96e0d4f7f44e2d9@sentry.io/1288164').install();

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
  'Warning',
  'Deprecation warning',
]);
YellowBox.ignoreWarnings(['Require cycle:']);

interface Props {}
interface State {
  renderApp: boolean;
  TaggToken: string;
}

// @codePush
class MyApp extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      renderApp: false,
      TaggToken: '',
    };
  }

  appReady = () => this.setState({ renderApp: true });

  componentWillMount = () => {
    AsyncStorage.getItem('TaggToken', (error, result) => {
      this.setState({ renderApp: true, TaggToken: result });
    });
  };

  render() {
    if (!this.state.renderApp) {
      return <Spinner />;
    }
    return (
      <ApolloProvider
        client={
          new ApolloClient({
            ...client,
            initializers: {
              isLoggedIn: () => !!this.state.TaggToken,
            },
          })
        }
      >
        <Root>
          <Authentication />
        </Root>
      </ApolloProvider>
    );
  }
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
};

export default codePush(codePushOptions)(MyApp);
