import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'native-base';
import { MyAppText, MyAppModal } from './common';
import EditSettingsContainer from './EditSettingsContainer';

class FilterModal extends React.Component {
    constructor(props) {
        super(props);

        this.blankState = {
            time: '',
            date: '',
            location: '',
            description: '',
        };

        this.state = this.blankState;
    }

    closeModal = () => {
      const { isVisible, flipFilterModal, refetchQueue } = this.props;

      if (isVisible) {
          flipFilterModal();
      }
      this.setState(this.blankState);
      if (refetchQueue) {
        refetchQueue();
      }
    }

    render() {
      const { isVisible } = this.props;
      return (
          <MyAppModal
              isVisible={isVisible}
              close={this.closeModal}
          >
              <EditSettingsContainer
                  hideNotifications
              />
              <Button block style={styles.buttonStyle} onPress={this.closeModal}>
                  <MyAppText style={styles.textStyle}>
                    {'Done'}
                  </MyAppText>
              </Button>
          </MyAppModal>
      )
    }
}

const styles = StyleSheet.create({
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
