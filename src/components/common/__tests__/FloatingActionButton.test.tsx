import React from 'react';

import { render } from 'react-native-testing-library';
import { Text } from 'react-native';
import { FloatingActionButton } from '../index';

describe('ErrorMessage', () => {
  it('default props w/ child renders without error', () => {
    render(
      <FloatingActionButton onPress={() => {}}>
        <Text>S</Text>
      </FloatingActionButton>,
    );
  });

  it('default props without children renders without error', () => {
    render(<FloatingActionButton onPress={() => {}} />);
  });

  it('style prop without children renders without error', () => {
    render(<FloatingActionButton style={{ backgroundColor: '#FFF' }} onPress={() => {}} />);
  });

  it('no children bottomRight position renders without error', () => {
    render(<FloatingActionButton position="bottomRight" onPress={() => {}} />);
  });

  it('no children bottomLeft position renders without error', () => {
    render(<FloatingActionButton position="bottomLeft" onPress={() => {}} />);
  });

  it('no children topLeft position renders without error', () => {
    render(<FloatingActionButton position="topLeft" onPress={() => {}} />);
  });

  it('no children topRight position renders without error', () => {
    render(<FloatingActionButton position="topRight" onPress={() => {}} />);
  });
});
