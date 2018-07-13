import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

const HorizontalLine = () => {
    return (
        <View
            style={styles.horizontalLine}
        />
    )
}

const styles = StyleSheet.create({
    horizontalLine: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginTop: 5,
        marginBottom: 20,
        opacity: 0.75,
    },
});

export {HorizontalLine};
