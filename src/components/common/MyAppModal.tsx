import React, { SFC, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Modal from 'react-native-modalbox';

interface Props {
  isVisible: boolean;
  close: () => any;
  children: ReactNode;
  swipeToClose?: boolean;
}

interface Style {
  container: ViewStyle;
}

const MyAppModal: SFC<Props> = ({
  isVisible, close, children, swipeToClose = true,
}) => (
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
    swipeToClose={swipeToClose}
  >
    <View style={styles.container}>{children}</View>
  </Modal>
);

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 25,
    borderWidth: 1,
    borderRadius: 8,
  },
});

export { MyAppModal };
