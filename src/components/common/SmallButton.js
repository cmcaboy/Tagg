import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import {Button} from './index';

const SmallButton = (props) => (
    <Button props={props}>
        {props.children}
    </Button>
);


const styles = StyleSheet.create({
    buttonStyle: {
        borderRadius: 10,
        //padding: 4,
    },
});

export {SmallButton};