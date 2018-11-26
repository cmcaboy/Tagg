import React, { SFC } from 'react';
import {
  View, Image, StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { MyAppText } from './index';
import { ProspectCard } from './ProspectCard';

interface Props {
  imageURL?: string;
  name: string;
}

interface Style {
  containerStyle: ViewStyle;
  imageStyle: ViewStyle;
  textStyle: TextStyle;
}

const Prospect: SFC<Props> = ({ imageURL = 'https://placebear.com/300/200', name }) => (
  <ProspectCard>
    <Image source={{ uri: imageURL }} style={styles.imageStyle} />
    <View style={styles.textStyle}>
      <MyAppText>{name}</MyAppText>
    </View>
  </ProspectCard>
);

const styles = StyleSheet.create<Style>({
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
