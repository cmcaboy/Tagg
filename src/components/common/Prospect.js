import React from 'react';
import { View,Image,StyleSheet } from 'react-native';
import {PropsectCard} from './ProspectCard';

const Prospect = ({imageURL = 'https://placebear.com/300/200',name}) => {
    return (
        <ProspectCard>
          <Image 
            source={{uri:imageURL}} 
            style={styles.imageStyle}
          />
          <View style={styles.textStyle}>
            <Text>{name}</Text>
          </View>
        </ProspectCard>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        backgroundColor: 'white',
        flex: 1,
        borderColor: '#ddd'
    },
    imageStyle: {
      borderRadius: 5,
      flex: 4
    },
    textStyle: {
      flex:1
    }
});

export {Prospect};