import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const FloatingActionButton = ({
  children,
  style = {},
  onPress = () => {},
  position = 'bottomRight',
}) => {
  const { floatingAction } = styles;
  let stylePosition = {};

  switch (position) {
    case 'bottomRight':
      stylePosition = { bottom: 30, right: 30 };
      break;
    case 'bottomLeft':
      stylePosition = { bottom: 30, left: 30 };
      break;
    case 'topRight':
      stylePosition = { top: 30, right: 30 };
      break;
    case 'topLeft':
      stylePosition = { top: 30, left: 30 };
      break;
    default:
      stylePosition = { bottom: 30, right: 30 };
  }

  return (
    <TouchableOpacity onPress={onPress} style={[floatingAction, stylePosition, style]}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingAction: {
    position: 'absolute',
    backgroundColor: '#000',
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOpacity: 0.5,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 2 },
  },
});

export { FloatingActionButton };
