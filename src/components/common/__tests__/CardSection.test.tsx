import React from 'react';

import { render } from 'react-native-testing-library';
import { Text } from 'react-native';
import { CardSection } from '../index';

describe('CardSection', () => {
  it('renders without error', () => {
    render(
      <CardSection>
        <Text>Sample Button</Text>
      </CardSection>,
    );
  });

  it('style prop renders without error', () => {
    render(
      <CardSection style={{ flexDirection: 'row' }}>
        <Text>Sample Button</Text>
      </CardSection>,
    );
  });
});
