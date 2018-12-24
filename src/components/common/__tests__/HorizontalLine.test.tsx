import React from 'react';

import { render } from 'react-native-testing-library';
import { HorizontalLine } from '../index';

describe('HorizontalLine', () => {
  it('default props renders without error', () => {
    render(<HorizontalLine />);
  });

  it('style prop renders without error', () => {
    render(<HorizontalLine style={{ backgroundColor: '#FFF' }} />);
  });
});
