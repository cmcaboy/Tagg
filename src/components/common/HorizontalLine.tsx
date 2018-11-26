import React, { SFC } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  style: ViewStyle;
}
interface Style {
  horizontalLine: ViewStyle;
}

const HorizontalLine: SFC<Props> = ({ style }) => <View style={[styles.horizontalLine, style]} />;

const styles = StyleSheet.create<Style>({
  horizontalLine: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    marginTop: 5,

    marginBottom: 20,
    opacity: 0.75,
  },
});

export { HorizontalLine };
