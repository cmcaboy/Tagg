import React, { ReactNode, SFC } from 'react';
import { Button } from './index';

interface Props {
  children: ReactNode;
}

const SmallButton: SFC<Props> = ({ children, ...rest }) => <Button props={rest}>{children}</Button>;

export { SmallButton };
