import React from 'react';
import renderer from 'react-test-renderer';
import App from './src/App';

it('renders without crashing', () => {
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toBeTruthy();
});
