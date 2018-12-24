import React from 'react';

import { render } from 'react-native-testing-library';
import { HeaderCard } from '../index';
import { SAMPLE_JSX_VIEW } from '../../../tests/test-data';

describe('HeaderCard', () => {
  it('default props renders without error', () => {
    render(<HeaderCard style={{ flexDirection: 'row' }}>{SAMPLE_JSX_VIEW}</HeaderCard>);
  });
});
