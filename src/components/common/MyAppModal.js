import React, {Component} from 'react';
import {StyleSheet,View} from 'react-native';
import Modal from 'react-native-modal'

const MyAppModal = (props) => {
  return (
    <Modal
      isVisible={props.isVisible}
      //transparent={false}
      animationInTiming={100}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      avoidKeyboard={true}
      onBackButtonPress={props.close}
      onBackdropPress={props.close}
      backdropOpacity={0.5}
    >
      <View style={styles.container}>
        {props.children}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'white',
    padding: 25,
    borderWidth: 1,
    borderRadius: 8,
},
});

export {MyAppModal};
