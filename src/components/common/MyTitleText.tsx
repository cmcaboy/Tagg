import React, { SFC, ReactNode } from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { MyAppText } from './index';
import { PRIMARY_COLOR } from '../../variables';

interface Props {
  style?: TextStyle;
  children: ReactNode;
}

interface Style {
  title: TextStyle;
}

const MyTitleText: SFC<Props> = ({ style, children }) => (
  <MyAppText style={[styles.title, style]}>{children}</MyAppText>
);

const styles = StyleSheet.create<Style>({
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: PRIMARY_COLOR,
    textAlign: 'center',
  },
});

export { MyTitleText };
