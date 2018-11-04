import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  List,
  ListItem,
  Container,
  Content,
  Right,
  Left,
  Body,
  Text,
  Button,
  Thumbnail,
} from 'native-base';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import EmptyList from './EmptyList';
import { MyAppText, Spinner, ErrorMessage } from './common';
import { CHOOSE_WINNER } from '../apollo/mutations';
import { GET_BIDS } from '../apollo/queries';
import { formatDate, formatDescription } from '../format';

class BidList extends React.Component {
  static navigationOptions = ({
    navigation: {
      state: {
        params: { datetimeOfDate },
      },
    },
  }) => ({
    // title: `${formatDate(datetimeOfDate)}`,
    headerTitle: (
      <View style={styles.headerViewStyle}>
        <MyAppText style={styles.textHeader}>Select a winner</MyAppText>
        <View style={{ width: 100 }} />
      </View>
    ),
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: 22,
      color: 'black',
    },
  });

  render() {
    const {
      navigation: {
        navigate,
        goBack,
        state: {
          params: { dateId, id },
        },
      },
    } = this.props;
    return (
      <Container>
        <Content>
          <Query query={GET_BIDS} variables={{ id: dateId }}>
            {({
              data, loading, error, refetch,
            }) => {
              console.log('BidList data: ', data);
              if (loading) return <Spinner />;
              if (error) return <ErrorMessage error={error.message} refetch={refetch} />;
              if (!data.otherBids.list.length) {
                return (
                  <EmptyList
                    refetch={refetch}
                    text="No one has bid on your date yet"
                    subText="Be patient!"
                  />
                );
              }
              return data.otherBids.list.map(date => (
                <List>
                  <ListItem
                    thumbnail
                    key={date.bidUser.id}
                    onPress={() => navigate('UserProfile', {
                      id: date.bidUser.id,
                      name: date.bidUser.name,
                      hostId: id,
                    })
                    }
                  >
                    <Left>
                      <Thumbnail square source={{ uri: date.bidUser.profilePic }} />
                    </Left>
                    <Body>
                      <Text>{date.bidUser.name}</Text>
                      <Text note numberOfLines={1}>
                        {date.bidPlace}
                      </Text>
                      <Text note numberOfLines={1}>
                        {formatDescription(date.bidDescription)}
                      </Text>
                    </Body>
                    <Right>
                      <Mutation mutation={CHOOSE_WINNER}>
                        {chooseWinner => (
                          <Button
                            transparent
                            onPress={() => {
                              console.log('winnerId: ', date.bidUser.id);
                              chooseWinner({
                                variables: {
                                  winnerId: date.bidUser.id,
                                  dateId,
                                  id,
                                },
                                optimisticResponse: {
                                  chooseWinner: {
                                    id: dateId,
                                    open: false,
                                    __typename: 'DateItem',
                                    optimistic: true,
                                  },
                                },
                                update: (store, newData) => {
                                  console.log('store: ', store);
                                  console.log('newData: ', newData);
                                  const fragment = gql`
                                    fragment chooseWinner on DateItem {
                                      open
                                    }
                                  `;
                                  let storeData = store.readFragment({
                                    id: newData.data.chooseWinner.id,
                                    fragment,
                                  });
                                  store.writeFragment({
                                    id: newData.data.chooseWinner.id,
                                    fragment,
                                    data: {
                                      ...storeData,
                                      open: newData.data.chooseWinner.open,
                                    },
                                  });

                                  const fragmentDateList = gql`
                                    fragment dateRequests on DateList {
                                      id
                                      list {
                                        id
                                      }
                                    }
                                  `;

                                  console.log(id);
                                  storeData = store.readFragment({
                                    id: `${id}d`,
                                    fragment: fragmentDateList,
                                  });
                                  console.log(`storeData for ${id}d: `, storeData);
                                  // storeData.forEach(datum => console.log('datum: ',datum));

                                  store.writeFragment({
                                    id: `${id}d`,
                                    fragment: fragmentDateList,
                                    data: {
                                      ...storeData,
                                      list: storeData.list.filter(
                                        d => d.id !== newData.data.chooseWinner.id,
                                      ),
                                    },
                                  });

                                  // const fragmentMatchList = gql`
                                  //     fragment matchedDates on MatchList {
                                  //         id
                                  //         list {
                                  //             id
                                  //             user {
                                  //                 id
                                  //                 __typename
                                  //             }
                                  //             __typename
                                  //         }
                                  //     }
                                  //     `;

                                  // const newDate = {
                                  //     id: newData.data.chooseWinner.id,
                                  //     matchId: newData.data.chooseWinner.id,
                                  //     user: {
                                  //         id: date.bidUser.id,
                                  //         __typename: 'User',
                                  //     },
                                  //     __typename: 'Match'
                                  // }

                                  // storeData = store.readFragment({
                                  //     id: `${id}m`,
                                  //     fragment: fragmentMatchList,
                                  // });
                                  // console.log(`storeData for ${id}m: ${storeData}`)
                                  // store.writeFragment({
                                  //     id: `${id}m`,
                                  //     fragment: fragmentMatchList,
                                  //     data: {
                                  //         id: `${id}m`,
                                  //         list: [newDate,...storeData.list],
                                  //         __typename: 'MatchList'
                                  //     }
                                  // });

                                  if (!newData.data.chooseWinner.optimistic) {
                                    refetch();
                                  }
                                },
                              });
                              return goBack();
                            }}
                          >
                            <Text>Choose</Text>
                          </Button>
                        )}
                      </Mutation>
                    </Right>
                  </ListItem>
                </List>
              ));
            }}
          </Query>
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
});

export default BidList;
