import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { YellowBox } from 'react-native';
import { Sentry } from 'react-native-sentry';
import { Root } from 'native-base';
import Authentication from './components/Authentication';
import { client } from './apollo';
import codePush from 'react-native-code-push';

Sentry.config('https://5bbde6be977141f6b96e0d4f7f44e2d9@sentry.io/1288164').install();

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
  'Warning',
  'Deprecation warning',
]);
YellowBox.ignoreWarnings(['Require cycle:']);

// @codePush
class MyApp extends Component {
  render() {
    return (
    <ApolloProvider client={client}>
      <Root>
        <Authentication />
      </Root>
    </ApolloProvider>
    )
  }
};

// codePush setup
// --------------
// Currently checking of updates on app start.
// I could also do on app resume, but I feel that this may be too aggressive.
const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START };

export default codePush(codePushOptions)(MyApp);