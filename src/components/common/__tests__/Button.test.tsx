import React from 'react';

import { render } from 'react-native-testing-library';
import { Button } from '../index';

describe('Button', () => {
  it('renders without error', () => {
    render(<Button onPress={() => {}}>Sample Button</Button>);
  });

  it('invertColor prop renders without error', () => {
    render(
      <Button onPress={() => {}} invertColors>
        {'Sample Button'}
      </Button>,
    );
  });
  it('textStyle prop renders without error', () => {
    render(
      <Button onPress={() => {}} textStyle={{ fontSize: 14 }}>
        {'Sample Button'}
      </Button>,
    );
  });
  it('buttonStyle prop renders without error', () => {
    render(
      <Button onPress={() => {}} buttonStyle={{ margin: 2 }}>
        {'Sample Button'}
      </Button>,
    );
  });
});
