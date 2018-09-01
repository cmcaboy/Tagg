import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import { Mutation } from 'react-apollo';
import {
  Container,
  Content,
  Form,
  Input,
  Label,
  Item,
  Button,
} from 'native-base';
import { MyAppText, CirclePicture } from './common';
import toastMessage from '../services/toastMessage';
import { formatDate } from '../format';
import { BID } from '../apollo/mutations';

// const GET_DATE = gql`
// query date($id: String!) {
//     date(id: $id) {
//         id
//         datetimeOfDate
//         description
//     }
//   }
// `;

class BidDate extends React.Component {
  static navigationOptions = ({
    navigation: {
      navigate,
      state: {
        params: {
          otherName,
          otherId,
          id,
          otherPic,
        },
      },
    },
  }) => ({
    //title: `${otherName}`,
    headerTitle: (
      <View style={styles.headerViewStyle}>
        <TouchableOpacity onPress={() => navigate('UserProfile',
          {
            id: otherId,
            name: otherName,
            hostId: id,
          })}
        >
          <CirclePicture imageURL={otherPic} picSize="mini" />
        </TouchableOpacity>
        <MyAppText style={styles.textHeader}>
          { `Ask ${otherName} out!` }
        </MyAppText>
        <View style={{ width: 30 }} />
      </View>
    ),
    headerTitleStyle:
      {
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight: 'normal',
        fontSize: 22,
        color: 'black',
      },
  })

  constructor(props) {
    super(props);
    this.state = {
      location: '',
      description: '',
    };
  }

    bid = (bid) => {
      const { navigation: { goBack, state: { params: { id, date, otherName } } } } = this.props;
      const { location, description } = this.state;
      bid({
        variables: {
          id,
          dateId: date.id,
          bidPlace: location,
          bidDescription: description,
        },
        update: (store, data) => {
          console.log('data: ', data);
          console.log('store: ', store);
          toastMessage({ text: `Thank you for bidding on ${otherName}'s date!` });
        },
      });
      goBack();
    };

    render() {
      const {
        navigation: {
          state: {
            params: {
              date: {
                datetimeOfDate, description,
              },
            },
          },
        },
      } = this.props;

      // const { datetimeOfDate, description, otherName} = this.props.navigation.state.params;
      return (
        <Container style={styles.container}>
          <Content>
            <KeyboardAvoidingView>
              <MyAppText style={styles.title}>
                {'Date/Time'}
              </MyAppText>
              <MyAppText style={styles.description}>
                {formatDate(datetimeOfDate)}
              </MyAppText>
              <MyAppText style={styles.title}>
                {'Description'}
              </MyAppText>
              <MyAppText style={styles.description}>
                {description}
              </MyAppText>
              <Form>
                <Item floatingLabel style={{ marginLeft: 0 }}>
                  <Label>
                    {'Date Location'}
                  </Label>
                  <Input autoFocus onChangeText={location => this.setState({ location })} />
                </Item>
                <Item floatingLabel style={{ marginLeft: 0 }}>
                  <Label>
                    {'Date Description'}
                  </Label>
                  <Input onChangeText={desc => this.setState({ description: desc })} />
                </Item>
                <Mutation mutation={BID}>
                  {bid => (
                    <Button block style={{ marginTop: 10 }} onPress={() => this.bid(bid)}>
                      <MyAppText style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>
                        { 'Submit' }
                      </MyAppText>
                    </Button>
                  )}
                </Mutation>
              </Form>
            </KeyboardAvoidingView>
          </Content>
        </Container>
      );
    }
}

// We put the styles in the component
const styles = StyleSheet.create({
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
    paddingVertical: 5,
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
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
