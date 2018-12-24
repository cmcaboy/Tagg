import React from 'react';

import { render } from 'react-native-testing-library';
import { CirclePicture } from '../index';

describe('Button', () => {
  it('default props renders without error', () => {
    render(<CirclePicture />);
  });

  it('imageURL prop renders without error', () => {
    render(<CirclePicture imageURL="NoImage" />);
  });

  it('picSize xlarge prop renders without error', () => {
    render(<CirclePicture picSize="xlarge" />);
  });

  it('picSize small prop renders without error', () => {
    render(<CirclePicture picSize="small" />);
  });

  it('picSize mini prop renders without error', () => {
    render(<CirclePicture picSize="mini" />);
  });

  it('auto prop renders without error', () => {
    render(<CirclePicture auto />);
  });
});
