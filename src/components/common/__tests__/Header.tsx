import React from 'react';

import { render } from 'react-native-testing-library';
import { Header } from '../index';
import { SAMPLE_TEXT } from '../../../tests/test-data';

// There are more things I could do with follow button, such as
// manipulate the followButton click if I so wanted to

describe('Header', () => {
  it('default props renders without error', () => {
    render(<Header headerText={SAMPLE_TEXT} />);
  });
});
