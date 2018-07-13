import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {MyAppText} from './index.js';
import {PRIMARY_COLOR} from '../../variables';

const MyTitleText = (props) => {
  return (
    <MyAppText style={[styles.title,props.style]}>
      {props.children}
    </MyAppText>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: PRIMARY_COLOR,
    textAlign: 'center',
},
});

export {MyTitleText};
