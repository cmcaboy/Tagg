import React from 'react';

import { render } from 'react-native-testing-library';
import { ActionIcon } from '../index';

describe('ActionItem Button', () => {
  // jest.mock('react-dom/server', () => {}, { virtual: true });
  it('renders without error', () => {
    render(<ActionIcon onPress={() => {}} name="done" size={14} color="#000" />);
  });
});
