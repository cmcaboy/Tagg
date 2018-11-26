import React, { ReactNode, SFC } from 'react';
import {
  Text, StyleSheet, TextStyle, TextProps,
} from 'react-native';
import { Fonts } from '../../utils/Fonts';

interface Props extends TextProps {
  children: ReactNode;
}

interface Style {
  textStyle: TextStyle;
}

const MyAppText: SFC<Props> = ({ style, children }) => (
  <Text style={[styles.textStyle, style]}>{children}</Text>
);

const styles = StyleSheet.create<Style>({
  textStyle: {
    fontFamily: Fonts.Oxygen,
  },
});

export { MyAppText };
