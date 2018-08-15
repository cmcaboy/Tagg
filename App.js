import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { YellowBox } from 'react-native';
import Authentication from './src/components/Authentication';
import { client } from './src/apollo';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Warning']);

export default () => (
  <ApolloProvider client={client}>
    <Authentication />
  </ApolloProvider>
);
