import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { YellowBox } from 'react-native';
import { Sentry } from 'react-native-sentry';
import { Root } from 'native-base';
import Authentication from './components/Authentication';
import { client } from './apollo';

Sentry.config('https://5bbde6be977141f6b96e0d4f7f44e2d9@sentry.io/1288164').install();

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
  'Warning',
  'Deprecation warning',
]);
YellowBox.ignoreWarnings(['Require cycle:']);

export default () => (
  <ApolloProvider client={client}>
    <Root>
      <Authentication />
    </Root>
  </ApolloProvider>
);
