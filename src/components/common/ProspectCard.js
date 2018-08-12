import React from 'react';
import { View } from 'react-native';

const ProspectCard = ({ style, children }) => (
    <View style={[styles.containerStyle, style]}>
        {children}
    </View>
);

const styles = {
    containerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        backgroundColor: 'white',
        flex: 1,
        borderColor: '#ddd',
        boxShadow: 5,
    }
};

export { ProspectCard };
