import React from 'react';

import { render } from 'react-native-testing-library';
import { Spinner } from '../index';

describe('Spinner', () => {
  it('default props renders without error', () => {
    render(<Spinner />);
  });
});
