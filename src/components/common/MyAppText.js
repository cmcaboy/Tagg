import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import { Fonts } from '../../utils/Fonts';
//import { Font } from 'expo';

class MyAppText extends Component {
  
  render() {
    return (
      <Text style={[styles.textStyle,this.props.style]}>{this.props.children}</Text>
    )
  }
}

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: Fonts.Oxygen
  }
});

export {MyAppText};
