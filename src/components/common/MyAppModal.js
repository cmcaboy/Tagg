import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modalbox';

const MyAppModal = ({ isVisible, close, children }) => (
  // <Modal
  //   isVisible={props.isVisible}
  //   //transparent={false}
  //   animationInTiming={100}
  //   animationIn="slideInUp"
  //   animationOut="slideOutDown"
  //   avoidKeyboard={true}
  //   onBackButtonPress={props.close}
  //   onBackdropPress={props.close}
  //   backdropOpacity={0.5}
  // >
  <Modal
    isOpen={isVisible}
    animationDuration={200}
    // transparent={false}
    backButtonClose
    onClosed={close}
    coverScreen
  >
    <View style={styles.container}>
      {children}
    </View>
  </Modal>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 25,
    borderWidth: 1,
    borderRadius: 8,
},
});

export { MyAppModal };
