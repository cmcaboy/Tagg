import React from 'react';

import { render } from 'react-native-testing-library';
import { MyAppModal } from '../index';
import { SAMPLE_JSX_VIEW } from '../../../tests/test-data';

describe('MyAppModal', () => {
  it('default props renders without error', () => {
    render(
      <MyAppModal isVisible close={() => {}}>
        {SAMPLE_JSX_VIEW}
      </MyAppModal>,
    );
  });

  it('swipeToClose prop renders without error', () => {
    render(
      <MyAppModal swipeToClose isVisible close={() => {}}>
        {SAMPLE_JSX_VIEW}
      </MyAppModal>,
    );
  });

  it('swipeToClose=false prop renders without error', () => {
    render(
      <MyAppModal swipeToClose={false} isVisible close={() => {}}>
        {SAMPLE_JSX_VIEW}
      </MyAppModal>,
    );
  });
});
