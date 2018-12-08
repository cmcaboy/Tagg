import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Mutation } from 'react-apollo';
import {
  Container, Content, Form, Input, Label, Item, Button,
} from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { MyAppText, CirclePicture } from './common';
import toastMessage from '../services/toastMessage';
import { formatDate } from '../format';
import { BID } from '../apollo/mutations';
import { bid, bidVariables } from '../apollo/mutations/__generated__/bid';

// Steps to incorporate types
// 1) Define State and Props interfaces
// 2) define class for query or mutation
//    extend mutation/query class with query/mutation types
// 3) replace Query or Mutation component with new class
// 4) Make Params interface with navigation params
// 5) Change navigation destructuring variables
// 6) Make Style interface and inserted it into StyleSheet

interface State {
  location: string;
  description: string;
}

interface Params {
  otherName: string;
  otherId: string;
  id: string;
  otherPic: string;
  datetimeOfDate?: string;
  description?: string;
  date?: any;
}

class BidMutation extends Mutation<bid, bidVariables> {}

interface Props extends NavigationScreenProps<Params> {
  date: any;
}

class BidDate extends React.Component<Props, State> {
  static navigationOptions = ({
    navigation,
    navigation: { navigate },
  }: NavigationScreenProps<Params>) => {
    // typings for react navigation do not work unless I use this format
    const otherName = navigation.state.params ? navigation.state.params.otherName : '';
    const otherId = navigation.state.params ? navigation.state.params.otherId : '';
    const id = navigation.state.params ? navigation.state.params.id : '';
    const otherPic = navigation.state.params ? navigation.state.params.otherPic : '';
    return {
      // title: `${otherName}`,
      headerTitle: (
        <View style={styles.headerViewStyle}>
          <TouchableOpacity
            onPress={() => navigate('UserProfile', {
              id: otherId,
              name: otherName,
              hostId: id,
            })
            }
          >
            <CirclePicture imageURL={otherPic} picSize="mini" />
          </TouchableOpacity>
          <MyAppText style={styles.textHeader}>{`Ask ${otherName} out!`}</MyAppText>
          <View style={{ width: 30 }} />
        </View>
      ),
      // header: {
      //   style: {
      //     paddingTop: 0,
      //     height: 40,
      //   },
      // },
      headerTitleStyle: {
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight: 'normal',
        fontSize: 22,
        color: 'black',
      },
    };
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      location: '',
      description: '',
    };
    console.log('dummy');
  }

  bid = (bid: (obj: any) => any) => {
    const {
      navigation,
      navigation: { goBack },
    } = this.props;

    // typings for react navigation do not work unless I use this format
    const id = navigation.state.params ? navigation.state.params.id : '';
    const otherName = navigation.state.params ? navigation.state.params.otherName : '';
    const date = navigation.state.params ? navigation.state.params.date : '';

    const { location, description } = this.state;
    bid({
      variables: {
        id,
        dateId: date.id,
        bidPlace: location,
        bidDescription: description,
      },
      update: (store: any, data: any) => {
        console.log('data: ', data);
        console.log('store: ', store);
        toastMessage({ text: `Thank you for bidding on ${otherName}'s date!` });
      },
    });
    goBack();
  };

  render() {
    const { navigation } = this.props;

    // typings for react navigation do not work unless I use this format
    const date = navigation.state.params.date ? navigation.state.params.date : '';
    const { datetimeOfDate, description } = date;

    // const { datetimeOfDate, description, otherName} = this.props.navigation.state.params;
    return (
      <Container style={styles.container as ViewStyle}>
        <Content>
          <KeyboardAvoidingView>
            <MyAppText style={styles.title}>Date/Time</MyAppText>
            <MyAppText style={styles.description}>{formatDate(datetimeOfDate)}</MyAppText>
            <MyAppText style={styles.title}>Description</MyAppText>
            <MyAppText style={styles.description}>{description}</MyAppText>
            <Form>
              <Item floatingLabel style={{ marginLeft: 0 }}>
                <Label>Date Location</Label>
                <Input autoFocus onChangeText={location => this.setState({ location })} />
              </Item>
              <Item floatingLabel style={{ marginLeft: 0 }}>
                <Label>Date Description</Label>
                <Input onChangeText={desc => this.setState({ description: desc })} />
              </Item>
              <BidMutation mutation={BID}>
                {bid => (
                  <Button block style={{ marginTop: 10 }} onPress={() => this.bid(bid)}>
                    <MyAppText style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>
                      {'Submit'}
                    </MyAppText>
                  </Button>
                )}
              </BidMutation>
            </Form>
          </KeyboardAvoidingView>
        </Content>
      </Container>
    );
  }
}

interface Style {
  textHeader: TextStyle;
  headerViewStyle: ViewStyle;
  container: ViewStyle;
  title: TextStyle;
  description: TextStyle;
}

// We put the styles in the component
const styles = StyleSheet.create<Style>({
  textHeader: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
    paddingLeft: 8,
  },
  headerViewStyle: {
    flexDirection: 'row',
    // paddingVertical: 5,
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    opacity: 0.75,
  },
});

export default BidDate;
