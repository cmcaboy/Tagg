import React from 'react';

import { render } from 'react-native-testing-library';
import { SmallButton } from '../index';
import { SAMPLE_JSX_VIEW } from '../../../tests/test-data';

describe('SmallButton', () => {
  it('default props renders without error', () => {
    render(<SmallButton onPress={() => {}}>{SAMPLE_JSX_VIEW}</SmallButton>);
  });
});
