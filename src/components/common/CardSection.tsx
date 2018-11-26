import React, { SFC, ReactNode } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface Props {
  style?: ViewStyle;
  children: ReactNode;
}

interface Style {
  containerStyle: ViewStyle;
}
const CardSection: SFC<Props> = ({ style, children }) => (
  <View style={[styles.containerStyle, style]}>{children}</View>
);

const styles = StyleSheet.create<Style>({
  containerStyle: {
    borderBottomWidth: 1,
    padding: 5,
    // backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
  },
});

export { CardSection };
