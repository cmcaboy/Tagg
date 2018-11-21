import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import {
  List, ListItem, Container, Content,
} from 'native-base';
import { Query } from 'react-apollo';
import { formatDate, formatDescription } from '../format';
import {
  MyAppText, CirclePicture, Spinner, ErrorMessage,
} from './common';
import { GET_DATES } from '../apollo/queries';

class OpenDateList extends React.Component {
  static navigationOptions = ({
    navigation: {
      navigate,
      state: {
        params: {
          otherId, otherName, id, otherPic,
        },
      },
    },
  }) => ({
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
        <MyAppText style={styles.textHeader}>{`${otherName}'s open dates`}</MyAppText>
        <View style={{ width: 30 }} />
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
    console.log('OpenDateList props: ', this.props);
    const {
      navigation: {
        navigate,
        state: {
          params,
          params: { otherId },
        },
      },
    } = this.props;
    return (
      <Container>
        <Content>
          <List>
            <Query query={GET_DATES} variables={{ id: otherId }}>
              {({
                data, loading, error, refetch,
              }) => {
                if (loading) return <Spinner />;
                if (error) return <ErrorMessage error={error.message} refetch={refetch} />;
                console.log('data.user.dateRequests.list: ', data.user.dateRequests.list);
                return data.user.dateRequests.list.filter(date => date.open).map(date => (
                  <ListItem
                    key={date.id}
                    onPress={() => navigate('BidDate', {
                      date,
                      ...params,
                    })
                    }
                  >
                    <View style={styles.listItemText}>
                      <MyAppText>{formatDate(date.datetimeOfDate)}</MyAppText>
                      <MyAppText>{formatDescription(date.description)}</MyAppText>
                    </View>
                  </ListItem>
                ));
              }}
            </Query>
          </List>
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
  listItemText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default OpenDateList;