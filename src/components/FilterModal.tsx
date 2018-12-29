import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Button } from 'native-base';
import { MyAppText, MyAppModal } from './common';
import EditSettingsContainer from './EditSettingsContainer';
import { analytics } from '../firebase';

interface Props {
  isVisible: boolean;
  flipFilterModal: () => any;
  refetchQueue: () => any;
}

interface State {
  time: string;
  date: string;
  location: string;
  description: string;
}

const blankState = {
  time: '',
  date: '',
  location: '',
  description: '',
};

class FilterModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = blankState;
  }

  componentDidMount = () => {
    analytics.setCurrentScreen('Filter_Modal');
    analytics.logEvent('Page_Filter_Modal');
  };

  closeModal = () => {
    const { isVisible, flipFilterModal, refetchQueue } = this.props;

    if (isVisible) {
      flipFilterModal();
    }
    this.setState(blankState);
    if (refetchQueue) {
      refetchQueue();
    }
    analytics.logEvent('Click_FilterModal_closeModal');
  };

  render() {
    const { isVisible } = this.props;
    return (
      <MyAppModal isVisible={isVisible} close={this.closeModal}>
        <EditSettingsContainer hideNotifications />
        <Button
          accessible={false}
          block
          style={styles.buttonStyle as ViewStyle}
          onPress={this.closeModal}
        >
          <MyAppText style={styles.textStyle}>Done</MyAppText>
        </Button>
      </MyAppModal>
    );
  }
}

interface Style {
  buttonStyle: ViewStyle;
  textStyle: TextStyle;
}

const styles = StyleSheet.create<Style>({
  buttonStyle: {
    marginTop: 10,
  },
  textStyle: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18,
  },
});

export default FilterModal;
