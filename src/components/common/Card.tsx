import React from 'react';
import { View } from 'react-native';

const Card = ({ style, children }) => <View style={[styles.containerStyle, style]}>{children}</View>;

// We put the styles in the component

const styles = {
  containerStyle: {
    borderWidth: 1,
    borderRadius: 7,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    // just like border radius, but with shadows
    shadowRadius: 2,
    // elevation makes items appear to jump out
    elevation: 1,
    // margin operates just as they do in css
    // marginLeft: 5,
    // marginRight: 5,
    padding: 10,

    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
};

export { Card };
