import React from 'react';

import { render } from 'react-native-testing-library';
import { Input } from '../index';

describe('Input', () => {
  it('default props renders without error', () => {
    render(<Input value="" placeholder="Text goes here" onChangeText={() => {}} />);
  });

  it('secureTextEntry prop renders without error', () => {
    render(<Input value="" secureTextEntry placeholder="Text goes here" onChangeText={() => {}} />);
  });

  it('label prop renders without error', () => {
    render(
      <Input value="" label="some label" placeholder="Text goes here" onChangeText={() => {}} />,
    );
  });
});
