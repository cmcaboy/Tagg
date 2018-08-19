import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import {
  List,
  ListItem,
  Text,
  Right,
  Body,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Query } from 'react-apollo';
import { PRIMARY_COLOR } from '../variables';
import { CirclePicture, MyAppText, Spinner, ErrorMessage } from './common';
import { GET_MATCHES } from '../apollo/queries';
import { GET_ID } from '../apollo/local/queries';
import {
  formatDescription,
  formatDate,
  formatBids,
  formatDay,
  formatName,
} from '../format';

class Matches extends Component {
    noMatches = () => (
      <View style={styles.noMatches}>
        <Ionicons
            name="md-sad"
            size={100}
            color="black"
        />
          <MyAppText>
            {'You do not have any matches.'}
          </MyAppText>
          <MyAppText>
            {'Better get to swipping!'}
          </MyAppText>
      </View>
    );

    renderContent({ matches, dateRequests, id, name, pic, refetch }) {
      const { navigation: { navigate } } = this.props;

      if (matches.length === 0 && dateRequests.length === 0) {
          return this.noMatches();
      }
      console.log('matches: ', matches);
      return (
        <View style={styles.matchContainer}>
          <View style={styles.newMatchesContainer}>
            <MyAppText style={styles.heading}>
              {'My Matched Dates'}
            </MyAppText>
            <ScrollView
              horizontal
            >
            {matches.map(match => (
              <TouchableOpacity
                  onPress={() => navigate('MessengerContainer', {
                      matchId: match.matchId,
                      id,
                      otherId: match.user.id,
                      name,
                      otherName: match.user.name,
                      pic,
                      otherPic: match.user.pics[0],
                  })}
                  key={match.user.id}
              >
                <View style={styles.newMatch}>
                  <CirclePicture imageURL={match.user.pics[0]} picSize="small" />
                  <MyAppText>
                    {formatName(match.user.name)}
                  </MyAppText>
                  <MyAppText>
                    {formatDay(match.datetimeOfDate)}
                  </MyAppText>
                </View>
              </TouchableOpacity>
            ))}
            </ScrollView>
          </View>
          <View style={styles.messagesContainer}>
            <MyAppText style={styles.heading}>
              {'My Open Dates'}
            </MyAppText>
            <ScrollView>
              <List>
                {dateRequests.map(date => (
                  <ListItem
                    key={date.id}
                    style={{ marginLeft: 0 }}
                    onPress={() => navigate('BidList', {
                      dateId: date.id,
                      datetimeOfDate: date.datetimeOfDate,
                      id,
                      refetch,
                    })}
                  >
                    <Body>
                      <Text>
                        {formatDate(date.datetimeOfDate)}
                      </Text>
                      <Text note numberOfLines={1}>
                        {formatDescription(date.description)}
                      </Text>
                    </Body>
                    <Right>
                      <Text>
                        {formatBids(date.num_bids)}
                      </Text>
                    </Right>
                  </ListItem>
                ))}
              </List>
            </ScrollView>
          </View>
        </View>
      );
    }

    render() {
        return (
          <Query query={GET_ID}>
            {({ loading, error, data }) => {
              // console.log('local data: ',data);
              // console.log('local error: ',error);
              // console.log('local loading: ',loading);
              if (loading) return <Spinner />;
              if (error) return <ErrorMessage error={error.message} />;

              const { id } = data.user;
              return (
                <Query query={GET_MATCHES} variables={{ id }}>
                  {({ loading, error, data, networkStatus, refetch }) => {
                    console.log('data in matches: ', data);
                    // console.log('error: ',error);
                    // console.log('loading: ',loading);
                    // console.log('networkStatus: ',networkStatus);
                    if (loading) return <Spinner />;
                    if (error) return <ErrorMessage error={error.message} />;
                    return this.renderContent({
                      matches: data.user.matchedDates.list,
                      dateRequests: data.user.dateRequests.list,
                      id,
                      name: data.user.name,
                      pic: data.user.profilePic,
                      refetch,
                    });
                  }}
                </Query>
              );
            }}
          </Query>
        );
    }
}

const styles = StyleSheet.create({
  matchContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 5,
    backgroundColor: '#FFFFFF',
  },
  newMatchesContainer: {
    flex: 2,
  },
  messagesContainer: {
    flex: 5,
  },
  newMatch: {
    margin: 5,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
  },
  noMatches: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    // fontWeight: '500',
    color: PRIMARY_COLOR,
    marginTop: 10,
    marginBottom: 5,
  },
});

export default Matches;
