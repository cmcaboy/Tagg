import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { YellowBox } from 'react-native';
<<<<<<< HEAD
import Authentication from './src/components/Authentication';
import { client } from './src/apollo';

import { Sentry } from 'react-native-sentry';
=======
import { Sentry } from 'react-native-sentry';
import { Root } from 'native-base';
import Authentication from './src/components/Authentication';
import { client } from './src/apollo';

>>>>>>> temp2

Sentry.config('https://5bbde6be977141f6b96e0d4f7f44e2d9@sentry.io/1288164').install();


YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Warning']);
<<<<<<< HEAD

export default () => (
  <ApolloProvider client={client}>
    <Authentication />
=======
YellowBox.ignoreWarnings(['Require cycle:']);

export default () => (
  <ApolloProvider client={client}>
    <Root>
      <Authentication />
    </Root>
>>>>>>> temp2
  </ApolloProvider>
);
