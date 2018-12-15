import React from 'react';
import {
  View, StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
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
import { NavigationScreenProps } from 'react-navigation';
import { listenerCount } from 'cluster';
import EmptyList from './EmptyList';
import { MyAppText, Spinner, ErrorMessage } from './common';
import { CHOOSE_WINNER } from '../apollo/mutations';
import { GET_BIDS } from '../apollo/queries';
import { formatDescription } from '../format';
import { otherBids, otherBidsVariables } from '../apollo/queries/__generated__/otherBids';
import { GET_MATCHES } from '../apollo/queries/index';

interface State {}

interface Props extends NavigationScreenProps<Params> {}

interface Params {
  dateId: string;
  id: string;
}

class GetBids extends Query<otherBids, otherBidsVariables> {}

class BidList extends React.Component<Props, State> {
  static navigationOptions = () => ({
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
          <GetBids query={GET_BIDS} variables={{ id: dateId }} fetchPolicy="network-only">
            {({
              data, loading, error, refetch,
            }) => {
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
                                  dateId,
                                  id,
                                  winnerId: date.bidUser.id,
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

                                  // grab matches query in local cache
                                  const {
                                    user,
                                    user: {
                                      matchedDates,
                                      matchedDates: { list: matchList },
                                      dateRequests,
                                      dateRequests: { list: dateList },
                                    },
                                  } = store.readQuery({ query: GET_MATCHES });
                                  console.log('user: ', user);

                                  // Update the cache with after chooseWinner completes
                                  store.writeQuery({
                                    query: GET_MATCHES,
                                    data: {
                                      user: {
                                        ...user,
                                        dateRequests: {
                                          ...dateRequests,
                                          list: dateList.filter(
                                            (date: any) => date.id !== newData.data.chooseWinner.id,
                                          ),
                                        },
                                        matchedDates: {
                                          ...matchedDates,
                                          list: [newData.data.chooseWinner.id, ...matchList],
                                        },
                                      },
                                    },
                                  });
                                  // onCompleted is a bit buggy at the moment
                                  // So I am using this logic

                                  // Read Query for GET_MATCHES
                                  // Write Query for GET_MATCHES
                                  // Remove the entry for DateRequest
                                  // Add an entry for matchedDates

                                  // const fragment = gql`
                                  //   fragment chooseWinner on DateItem {
                                  //     open
                                  //   }
                                  // `;
                                  // let storeData: any = store.readFragment({
                                  //   fragment,
                                  //   id: newData.data.chooseWinner.id,
                                  // });
                                  // store.writeFragment({
                                  //   fragment,
                                  //   id: newData.data.chooseWinner.id,
                                  //   data: {
                                  //     ...storeData,
                                  //     open: newData.data.chooseWinner.open,
                                  //   },
                                  // });

                                  // const fragmentDateList = gql`
                                  //   fragment dateRequests on DateList {
                                  //     id
                                  //     list {
                                  //       id
                                  //     }
                                  //   }
                                  // `;

                                  // console.log(id);
                                  // storeData = store.readFragment({
                                  //   id: `${id}d`,
                                  //   fragment: fragmentDateList,
                                  // });
                                  // console.log(`storeData for ${id}d: `, storeData);
                                  // // storeData.forEach(datum => console.log('datum: ',datum));

                                  // store.writeFragment({
                                  //   id: `${id}d`,
                                  //   fragment: fragmentDateList,
                                  //   data: {
                                  //     ...storeData,
                                  //     list: storeData.list.filter(
                                  //       ( d: any ) => d.id !== newData.data.chooseWinner.id,
                                  //     ),
                                  //   },
                                  // });

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

                                  // if (!newData.data.chooseWinner.optimistic) {
                                  //   refetch();
                                  // }
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
          </GetBids>
        </Content>
      </Container>
    );
  }
}

interface Style {
  textHeader: TextStyle;
  headerViewStyle: ViewStyle;
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
    paddingVertical: 5,
  },
});

export default BidList;
