import React, { ReactNode, SFC } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  style: ViewStyle;
  children: ReactNode;
}

interface Style {
  containerStyle: ViewStyle;
}

const HeaderCard: SFC<Props> = ({ style, children }) => (
  <View style={[styles.containerStyle, style]}>{children}</View>
);

// We put the styles in the component
const styles = StyleSheet.create<Style>({
  containerStyle: {
    borderWidth: 1,
    borderRadius: 7,
    // borderColor: '#ddd',
    // borderBottomWidth: 0,
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
    minHeight: 50,

    // margin: 5,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
    marginLeft: 5,
  },
});

export { HeaderCard };
