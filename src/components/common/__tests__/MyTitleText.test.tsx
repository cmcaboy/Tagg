import React from 'react';

import { render } from 'react-native-testing-library';
import { MyTitleText } from '../index';
import { SAMPLE_JSX_TEXT } from '../../../tests/test-data';

describe('MyTitleText', () => {
  it('default props renders without error', () => {
    render(<MyTitleText>{SAMPLE_JSX_TEXT}</MyTitleText>);
  });
});
