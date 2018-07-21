import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const Button = ({onPress, children, buttonStyle, textStyle, invertColors = false}) => {
    const {buttonStyleDefault, textStyleDefault, invertedColorsButton, invertedColorsText} = styles;
    return (
        <TouchableOpacity onPress={onPress} style={[buttonStyleDefault,buttonStyle,invertColors && invertedColorsButton]}>
            <Text style={[textStyleDefault,textStyle,invertColors && invertedColorsText]}>{children}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    textStyleDefault: {
        alignSelf: 'center',
        color: '#007aff',
        fontSize: 16,
        fontWeight: '600',
        padding: 6,
    },
    buttonStyleDefault: {
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#007aff',
        // marginLeft: 5,
        // marginRight: 5
    },
    invertedColorsButton: {
        backgroundColor: '#007aff',
    },
    invertedColorsText: {
        color: '#fff'
    }
});

export {Button};



