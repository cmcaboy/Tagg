import React from 'react';

import { render } from 'react-native-testing-library';
import Authentication from '../Authentication';

describe('Authentication Component', () => {
  // jest.mock('react-dom/server', () => {}, { virtual: true });
  it('renders without error', () => {
    render(<Authentication />);
  });
});
