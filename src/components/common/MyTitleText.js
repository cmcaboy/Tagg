import React from 'react';
import { StyleSheet } from 'react-native';
import { MyAppText } from './index';
import { PRIMARY_COLOR } from '../../variables';

const MyTitleText = ({ style, children }) => (
  <MyAppText style={[styles.title, style]}>{children}</MyAppText>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: PRIMARY_COLOR,
    textAlign: 'center',
  },
});

export { MyTitleText };
