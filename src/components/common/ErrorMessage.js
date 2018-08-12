import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MyAppText } from './MyAppText';

const ErrorMessage = ({ error }) => (
    <View style={styles.errorStyle}>
      <MyAppText>
        {`Whoops! Something with wrong: ${error}`}
      </MyAppText>
    </View>
);

const styles = StyleSheet.create({
  errorStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export { ErrorMessage };
