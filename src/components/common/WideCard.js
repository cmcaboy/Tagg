import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CARD_HEIGHT, CARD_FOOTER_HEIGHT, CARD_MARGIN } from '../../variables';

const WideCard = ({ footer, children }) => {
    const HEIGHT = footer ? CARD_HEIGHT + CARD_FOOTER_HEIGHT : CARD_HEIGHT;
    return (
        <View style={[styles.containerStyle, { height: HEIGHT }]}>
            {children}
        </View>
    );
};


// We put the styles in the component
const styles = StyleSheet.create({
    containerStyle: {
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        // just like border radius, but with shadows
        shadowRadius: 2,
        // elevation makes items appear to jump out
        elevation: 1,
        // margin operates just as they do in css
        backgroundColor: '#FFFFFF',
        // alignItems: 'center',
        // minHeight: 130,
        margin: CARD_MARGIN,
    },  
});

export { WideCard };
