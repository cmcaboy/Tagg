import React from 'react';

import { render } from 'react-native-testing-library';
import { CondInput } from '../index';

describe('CondInput', () => {
  it('default props renders without error', () => {
    render(<CondInput updateValue={() => {}} value="sample name" field="name" />);
  });

  it('lowerCaseOnly prop renders without error', () => {
    render(<CondInput lowerCaseOnly updateValue={() => {}} value="sample name" field="name" />);
  });

  it('multiline prop renders without error', () => {
    render(<CondInput multiline updateValue={() => {}} value="sample name" field="name" />);
  });

  it('secureTextEntry prop renders without error', () => {
    render(<CondInput secureTextEntry updateValue={() => {}} value="sample name" field="name" />);
  });
});
