import React from 'react';

import { render } from 'react-native-testing-library';
import { MyAppText } from '../index';
import { SAMPLE_JSX_TEXT } from '../../../tests/test-data';

describe('MyAppText', () => {
  it('default props renders without error', () => {
    render(<MyAppText>{SAMPLE_JSX_TEXT}</MyAppText>);
  });
});
