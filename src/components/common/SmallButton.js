import React from 'react';
import { Button } from './index';

const SmallButton = ({ props, props: { children } }) => (
    <Button props={props}>
        {children}
    </Button>
);

export { SmallButton };
