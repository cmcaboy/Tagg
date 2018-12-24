import React from 'react';

import { render } from 'react-native-testing-library';
import { ProspectCard } from '../index';
import { SAMPLE_JSX_VIEW } from '../../../tests/test-data';

describe('ProspectCard', () => {
  it('default props renders without error', () => {
    render(<ProspectCard>{SAMPLE_JSX_VIEW}</ProspectCard>);
  });

  it('style prop renders without error', () => {
    render(<ProspectCard style={{ flex: 1 }}>{SAMPLE_JSX_VIEW}</ProspectCard>);
  });
});
