import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ActionIcon = ({ onPress, style, name = 'done', color = 'green', size = 14 }) => {
    const { iconStyle } = styles;
    return (
        <TouchableOpacity onPress={onPress} style={[iconStyle, style]}>
            <MaterialIcons name={name} color={color} size={size} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    iconStyle: {
        alignSelf: 'center',
        paddingVertical: 10,
        paddingRight: 10,
        paddingLeft: 20,
    },
})

export { ActionIcon };
