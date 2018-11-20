import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { MyAppText } from './index';
import { ProspectCard } from './ProspectCard';

const Prospect = ({ imageURL = 'https://placebear.com/300/200', name }) => (
  <ProspectCard>
    <Image source={{ uri: imageURL }} style={styles.imageStyle} />
    <View style={styles.textStyle}>
      <MyAppText>{name}</MyAppText>
    </View>
  </ProspectCard>
);

const styles = StyleSheet.create({
  containerStyle: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: 'white',
    flex: 1,
    borderColor: '#ddd',
  },
  imageStyle: {
    borderRadius: 5,
    flex: 4,
  },
  textStyle: {
    flex: 1,
  },
});

export { Prospect };
