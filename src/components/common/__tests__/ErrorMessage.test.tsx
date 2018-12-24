import React from 'react';

import { render } from 'react-native-testing-library';
import { ErrorMessage } from '../index';

describe('ErrorMessage', () => {
  it('default props renders without error', () => {
    render(<ErrorMessage error="Error!" />);
  });

  it('refetch prop enders without error', () => {
    render(<ErrorMessage refetch={() => {}} error="This is an error" />);
  });
});
