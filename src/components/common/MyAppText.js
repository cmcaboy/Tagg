import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import { Fonts } from '../../utils/Fonts';
//import { Font } from 'expo';

const MyAppText = (props) => {
  return (
    <Text style={[styles.textStyle,props.style]}>{props.children}</Text>
  )
}

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: Fonts.Oxygen
  }
});

export {MyAppText};
