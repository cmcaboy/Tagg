import React, { Component } from 'react';
import {
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Button } from 'native-base';
import { ApolloConsumer } from 'react-apollo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { EULAText } from '../variables/EULA';
import {
  MyAppModal, MyTitleText, Card, CardSection, MyAppText,
} from './common';

interface Props {
  isVisible: boolean;
  closeEULAModal: () => void;
}

interface State {}

export default class EULAModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  agree = async () => {
    const { closeEULAModal } = this.props;
    closeEULAModal();
    await AsyncStorage.setItem('TaggEULA', '0.2.0');
  };

  decline = async (client: any) => {
    // If the user declines the agreement, we cannot let them continue on with the app. As a result, we
    // need to log them out. The user could log back in, but would then be presented with the EULA modal again.
    await client.writeData({ data: { isLoggedIn: false } });
    await AsyncStorage.removeItem('TaggToken');
    await AsyncStorage.removeItem('TaggEULA');
  };

  render() {
    const { isVisible, closeEULAModal } = this.props;
    return (
      <MyAppModal isVisible={isVisible} close={closeEULAModal} swipeToClose={false}>
        <ScrollView>
          <Card>
            <CardSection>
              <MyTitleText> End User License Agreement </MyTitleText>
            </CardSection>
            <CardSection>
              <MyAppText>{EULAText}</MyAppText>
            </CardSection>
            <CardSection style={styles.buttonSection as ViewStyle}>
              <Button block onPress={this.agree}>
                <MyAppText style={styles.agreeTextStyle}>Agree</MyAppText>
              </Button>
              <ApolloConsumer>
                {client => (
                  <TouchableOpacity onPress={() => this.decline(client)} style={styles.declineView}>
                    <MyAppText style={styles.declineTextStyle}>decline</MyAppText>
                  </TouchableOpacity>
                )}
              </ApolloConsumer>
            </CardSection>
          </Card>
        </ScrollView>
      </MyAppModal>
    );
  }
}

interface Style {
  buttonSection: ViewStyle;
  agreeTextStyle: TextStyle;
  declineTextStyle: TextStyle;
  declineView: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  buttonSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agreeTextStyle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  declineTextStyle: {
    color: '#000',
    opacity: 0.65,
    fontSize: 12,
  },
  declineView: {
    marginTop: 15,
    marginBottom: 15,
  },
});
