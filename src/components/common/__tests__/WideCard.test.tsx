import React from 'react';

import { render } from 'react-native-testing-library';
import { WideCard } from '../index';
import { SAMPLE_JSX_VIEW } from '../../../tests/test-data';

describe('WideCard', () => {
  it('default props renders without error', () => {
    render(<WideCard>{SAMPLE_JSX_VIEW}</WideCard>);
  });
  it('footer prop renders without error', () => {
    render(<WideCard footer>{SAMPLE_JSX_VIEW}</WideCard>);
  });
});
