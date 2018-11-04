import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Fonts } from '../../utils/Fonts';

const MyAppText = ({ style, children }) => (
  <Text style={[styles.textStyle, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: Fonts.Oxygen,
  },
});

export { MyAppText };
