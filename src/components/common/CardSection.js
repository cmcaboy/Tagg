import React from 'react';
import { View } from 'react-native';

const CardSection = ({ style, children }) => {
    return (
<<<<<<< HEAD
        <View style={[styles.containerStyle, style]}>
=======
        <View style={[ styles.containerStyle, style ]}>
>>>>>>> temp2
            {children}
        </View>
    );
};

const styles = {
    containerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        // backgroundColor: '#fff',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
        position: 'relative',
    }
};

export { CardSection };