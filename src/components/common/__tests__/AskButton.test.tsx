import React from 'react';

import { render } from 'react-native-testing-library';
import { AskButton } from '../index';

describe('AskButton', () => {
  it('renders without error', () => {
    render(<AskButton onPress={() => {}} />);
  });
});
