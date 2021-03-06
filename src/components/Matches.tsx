import React, { Component } from 'react';
import {
  View, TouchableOpacity, StyleSheet, ScrollView, ViewStyle, TextStyle,
} from 'react-native';
import {
  List, ListItem, Text, Right, Body,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Query } from 'react-apollo';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { PRIMARY_COLOR, PLACEHOLDER_PHOTO } from '../variables';
import {
  CirclePicture, MyAppText, Spinner, ErrorMessage, FloatingActionButton,
} from './common';
import { GET_MATCHES } from '../apollo/queries';
// import { GET_ID } from '../apollo/local/queries';
import {
  formatDescription, formatDate, formatBids, formatDay, formatName,
} from '../format';
// import { getId } from '../apollo/queries/__generated__/getId';
import { getMatches } from '../apollo/queries/__generated__/getMatches';
import { analytics } from '../firebase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NewDateModal from './NewDateModal';
import { SECONDARY_COLOR } from '../variables/index';

interface Params {}

interface Props {
  navigation: NavigationScreenProp<NavigationRoute<Params>, Params>;
}

interface State {
  newDateModal?: boolean;
}

// class GetId extends Query<getId, {}> {};
class GetMatches extends Query<getMatches, {}> {}

class Matches extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      newDateModal: false,
    }
  }
  noMatches = () => {
    analytics.logEvent('Event_Matches_noMatchedDates');
    analytics.logEvent('Event_Matches_noDateRequests');
    return (
      <View style={styles.noMatches}>
        <Ionicons name="md-sad" size={100} color="black" />
        <MyAppText>You do not have any matches.</MyAppText>
        <MyAppText>Better get after it!</MyAppText>
      </View>
    )
  };

  flipNewDateModal = () => {
    analytics.logEvent('Click_Matches_open_newDt_mdl')
    this.setState(prev => ({ newDateModal: !prev.newDateModal }));
  }

  renderContent({
    matches,
    dateRequests,
    id,
    name,
    pic,
    refetch,
  }: {
  matches: any[];
  dateRequests: any[];
  id: string;
  name: string;
  pic: string;
  refetch: () => void;
  }) {
    const {
      navigation: { navigate },
    } = this.props;

    analytics.setUserProperty('num_matcheDates', `${matches.length}`)
    analytics.setUserProperty('num_dateRequests', `${dateRequests.length}`)

    if (matches.length === 0 && dateRequests.length === 0) {
      return this.noMatches();
    }
    // console.log('matches: ', matches);

    if (dateRequests.length === 0) {
      analytics.logEvent('Event_Matches_noDateRequests');
    } 
    if (matches.length === 0) {
      analytics.logEvent('Event_Matches_matchedDates');
    }

    return (
      <View style={styles.matchContainer}>
      <FloatingActionButton
          onPress={this.flipNewDateModal}
          style={{ backgroundColor: SECONDARY_COLOR, borderColor: PRIMARY_COLOR, borderWidth: 0 }}
          position="bottomRight"
        >
          <MaterialIcons name="add" size={40} color="#000" />
        </FloatingActionButton>
        <NewDateModal
          id={id}
          isVisible={this.state.newDateModal}
          flipNewDateModal={this.flipNewDateModal}
        />
        <View style={styles.newMatchesContainer}>
          <MyAppText style={styles.heading}>My Matched Dates</MyAppText>
          <ScrollView horizontal>
            {!matches.length && (
              <View style={styles.newMatch}>
                <CirclePicture imageURL={PLACEHOLDER_PHOTO} picSize="small" />
                <MyAppText>{formatName('No matches')}</MyAppText>
              </View>
            )}
            {matches.map((match: any) => (
              <TouchableOpacity
                accessible={false}
                onPress={() => {
                  analytics.logEvent('Click_Matches_MatchedDate')
                  return navigate('MessengerContainer', {
                    id,
                    name,
                    pic,
                    matchId: match.matchId,
                    otherId: match.user.id,
                    otherName: match.user.name,
                    otherPic: match.user.pics[0],
                  })
                  }}
                key={match.id}
              >
                <View style={styles.newMatch}>
                  <CirclePicture imageURL={match.user.pics[0]} picSize="small" />
                  <MyAppText>{formatName(match.user.name)}</MyAppText>
                  <MyAppText>{formatDay(match.datetimeOfDate)}</MyAppText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.messagesContainer}>
          <MyAppText style={styles.heading}>My Open Dates</MyAppText>
          <ScrollView style={{ flex: 1 }}>
            <List>
              {!dateRequests.length && (
                <View style={styles.newMatch}>
                  <CirclePicture imageURL={PLACEHOLDER_PHOTO} picSize="small" />
                  <MyAppText>{formatName('You havent created a date yet')}</MyAppText>
                </View>
              )}
              {dateRequests.map((date: any) => (
                <ListItem
                  accessible={false}
                  key={date.id}
                  style={{ marginLeft: 0 }}
                  onPress={() => {
                    analytics.logEvent('Click_Matches_dateRequestItem')
                    return navigate('BidList', {
                      id,
                      refetch,
                      dateId: date.id,
                      datetimeOfDate: date.datetimeOfDate,
                    })
                  }}
                >
                  <Body>
                    <Text>{formatDate(date.datetimeOfDate)}</Text>
                    <Text note numberOfLines={1}>
                      {formatDescription(date.description)}
                    </Text>
                  </Body>
                  <Right>
                    <Text>{formatBids(date.num_bids)}</Text>
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
      <GetMatches query={GET_MATCHES} fetchPolicy="network-only">
        {({
          loading, error, data, refetch,
        }) => {
          console.log('data in matches: ', data);
          // console.log('error: ',error);
          // console.log('loading: ',loading);
          if (loading) return <Spinner />;
          if (error) return <ErrorMessage error={error.message} refetch={refetch} />;

          if (!data.user) {
            console.log('noMatches');
            return this.noMatches();
          }
          const matches = data.user.matchedDates ? data.user.matchedDates.list : [];
          const dateRequests = data.user.dateRequests ? data.user.dateRequests.list : [];
          const { id } = data.user;
          return this.renderContent({
            id,
            refetch,
            matches,
            dateRequests,
            name: data.user.name,
            pic: data.user.profilePic,
          });
        }}
      </GetMatches>
    );
  }
}

interface Style {
  matchContainer: ViewStyle;
  newMatchesContainer: ViewStyle;
  messagesContainer: ViewStyle;
  newMatch: ViewStyle;
  noMatches: ViewStyle;
  heading: TextStyle;
}
const styles = StyleSheet.create<Style>({
  matchContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 5,
    backgroundColor: '#FFFFFF',
  },
  newMatchesContainer: {
    // flex: 2,
  },
  messagesContainer: {
    // flex: 5,
    flex: 1,
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
