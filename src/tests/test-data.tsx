import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PLACEHOLDER_PHOTO } from '../variables';

export const TEST_PHOTO = PLACEHOLDER_PHOTO;

export const TEST_ID = 'cory.mcaboy@gmail.com';
export const TEST_NAME = 'Cory McAboy';

export const TEST_SECONDARY_ID = 'test@test.com';

export const SAMPLE_TEXT = 'Tagg Sample text';
export const SAMPLE_JSX_VIEW = (
  <View>
    <Text>Sample Tagg View</Text>
  </View>
);
export const SAMPLE_JSX_TEXT = <Text>Sample Tagg Text</Text>;
export const SAMPLE_STYLE = StyleSheet.create({
  style: {
    flexDirection: 'row',
  },
});
