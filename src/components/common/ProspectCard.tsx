import React, { ReactNode, SFC } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface Props {
  style?: ViewStyle;
  children: ReactNode;
}

interface Style {
  containerStyle: ViewStyle;
}

const ProspectCard: SFC<Props> = ({ style, children }) => (
  <View style={[styles.containerStyle, style]}>{children}</View>
);

const styles = StyleSheet.create<Style>({
  containerStyle: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: 'white',
    flex: 1,
    borderColor: '#ddd',
    // boxShadow: 5, // Property not found
  },
});

export { ProspectCard };
