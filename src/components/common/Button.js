import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PRIMARY_COLOR } from '../../variables/index';

const Button = ({ onPress, children, buttonStyle, textStyle, invertColors = false }) => {
    const {
      buttonStyleDefault,
      textStyleDefault,
      invertedColorsButton,
      invertedColorsText,
    } = styles;
    return (
        <TouchableOpacity
          onPress={onPress}
          style={[buttonStyleDefault, buttonStyle, invertColors && invertedColorsButton]}
        >
            <Text style={[textStyleDefault, textStyle, invertColors && invertedColorsText]}>
              {children}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    textStyleDefault: {
        alignSelf: 'center',
        color: PRIMARY_COLOR,
        fontSize: 16,
        fontWeight: '600',
        padding: 6,
    },
    buttonStyleDefault: {
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
        // marginLeft: 5,
        // marginRight: 5
    },
    invertedColorsButton: {
        backgroundColor: PRIMARY_COLOR,
    },
    invertedColorsText: {
        color: '#fff',
    }
});

export { Button };
