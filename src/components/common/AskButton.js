import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MyAppText } from './index';

const AskButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonStyle}>
        <MyAppText style={styles.textStyle}>
          { 'Ask!' }
        </MyAppText>
    </TouchableOpacity>
);


const styles = StyleSheet.create({
    buttonStyle: {
        borderRadius: 10,
        paddingVertical: 4,
        paddingHorizontal: 10,
        margin: 4,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'green',
    },
    textStyle: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        
    }
});

export { AskButton };
