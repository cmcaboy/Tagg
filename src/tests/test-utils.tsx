import React from 'react';
import { render } from 'react-native-testing-library';
// this adds custom jest matchers from jest-dom
import { MockedProvider } from 'react-apollo/test-utils';

// We can pass in options as a second parameter to render if we want
// to do testing with refs within our components.
const renderApollo = (
  node: any,
  {
    mocks = {}, addTypename = {}, defaultOptions = {}, cache = {}, ...options
  } = {},
) => render(<MockedProvider>{node}</MockedProvider>);

export * from 'react-native-testing-library';
export { renderApollo };
