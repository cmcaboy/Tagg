import React from 'react';

import { render } from 'react-native-testing-library';
import { Text } from 'react-native';
import { Card } from '../index';

describe('Card', () => {
  it('renders without error', () => {
    render(
      <Card>
        <Text>Sample Card</Text>
      </Card>,
    );
  });

  it('invertColor prop renders without error', () => {
    render(<Card style={{ flexDirection: 'row' }}>Sample Button</Card>);
  });
});
