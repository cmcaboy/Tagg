import React, { SFC } from 'react';
import {
  View,
  ActivityIndicator,
  ViewStyle,
  StyleSheet,
  ActivityIndicatorProps,
} from 'react-native';

interface Props extends ActivityIndicatorProps {
  style?: ViewStyle;
}
interface Style {
  spinnerStyle: ViewStyle;
}

const Spinner: SFC<Props> = ({ size, style = styles.spinnerStyle }) => (
  <View style={style}>
    {/*
      you can pass in a size parameter. In this example,
      we are assigning the passed in parameter,
      but if none is specified, we will assign large as the size.
    */}
    <ActivityIndicator size={size || 'large'} />
  </View>
);

const styles = StyleSheet.create<Style>({
  spinnerStyle: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { Spinner };
