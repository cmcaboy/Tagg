import React, { SFC } from 'react';
import { Button } from './index';
import { ButtonProps } from './Button';

interface Props extends ButtonProps {}

const SmallButton: SFC<Props> = ({
  children, onPress, buttonStyle, textStyle, invertColors,
}) => (
  <Button
    onPress={onPress}
    buttonStyle={buttonStyle}
    textStyle={textStyle}
    invertColors={invertColors}
  >
    {children}
  </Button>
);

export { SmallButton };
