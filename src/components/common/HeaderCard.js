import React from 'react';
import {View,StyleSheet} from 'react-native';

const HeaderCard = (props) =>  {
    return (
        <View style={[styles.containerStyle,props.styles]}>
            {props.children}
        </View>
    )
}

// We put the styles in the component
const styles = StyleSheet.create({
    containerStyle: {
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.5,
        // just like border radius, but with shadows
        shadowRadius: 2,
        // elevation makes items appear to jump out
        elevation: 1,
        // margin operates just as they do in css
        backgroundColor: '#FFFFFF',
        //alignItems: 'center',
        minHeight: 50,
        //margin: 5,
        marginTop: 5,
        marginBottom: 5,
        marginRight: 5,
        marginLeft: 5,
    },  
});

export {HeaderCard};