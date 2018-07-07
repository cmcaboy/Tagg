import React from 'react';
import { ApolloProvider} from 'react-apollo';
import Authentication from './src/components/Authentication';
import { YellowBox } from 'react-native';
import {client} from './src/apollo';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader','Warning']);

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
          <Authentication />
      </ApolloProvider>
    );
  }
}

