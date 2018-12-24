import React from 'react';

import { render } from 'react-native-testing-library';
import { Prospect } from '../index';
import { TEST_NAME, TEST_PHOTO } from '../../../tests/test-data';

describe('Prospect', () => {
  it('default props renders without error', () => {
    render(<Prospect name={TEST_NAME} />);
  });

  it('imageURL prop renders without error', () => {
    render(<Prospect imageURL={TEST_PHOTO} name={TEST_NAME} />);
  });
});
