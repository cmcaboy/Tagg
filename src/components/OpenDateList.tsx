import React from 'react';
import {
  View, TouchableOpacity, StyleSheet, TextStyle, ViewStyle,
} from 'react-native';
import {
  List, ListItem, Container, Content,
} from 'native-base';
import { Query } from 'react-apollo';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { formatDate, formatDescription, trunc } from '../format';
import {
  MyAppText, CirclePicture, Spinner, ErrorMessage,
} from './common';
import { GET_DATES } from '../apollo/queries';
import { getDates, getDatesVariables } from '../apollo/queries/__generated__/getDates';
import { analytics } from '../firebase';
import { SECONDARY_WHITE } from '../variables';

interface Params {
  otherId: string;
  otherName: string;
  id: string;
  otherPic: string;
}

class GetDates extends Query<getDates, getDatesVariables> {}

interface Props {
  navigation: NavigationScreenProp<NavigationRoute<Params>, Params>;
}

interface State {}

class OpenDateList extends React.Component<Props, State> {
  static navigationOptions = ({
    navigation: {
      navigate,
      state: {
        params: {
          otherId, otherName, id, otherPic,
        },
      },
    },
  }: {
  navigation: NavigationScreenProp<NavigationRoute<Params>, Params>;
  }) => ({
    // title: `${otherName}`,
    headerRight: (
      <View style={styles.headerViewStyle}>
        <TouchableOpacity
          onPress={() => {
            analytics.logEvent('Click_OpenDateList_head_pic');
            return navigate('UserProfile', {
              id: otherId,
              name: otherName,
              hostId: id,
            });
          }}
        >
          <CirclePicture imageURL={otherPic} picSize="mini" />
        </TouchableOpacity>
        <MyAppText style={styles.textHeader}>{trunc(`${otherName}'s open dates`, 30)}</MyAppText>
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
          params: { otherId, id },
        },
      },
    } = this.props;
    console.log('id: ', id);
    console.log('otherId: ', otherId);
    return (
      <Container style={styles.container as ViewStyle}>
        <Content>
          <List>
            <GetDates query={GET_DATES} variables={{ id: otherId }} fetchPolicy="network-only">
              {({
                data, loading, error, refetch,
              }) => {
                if (loading) return <Spinner />;
                if (error) return <ErrorMessage error={error.message} refetch={refetch} />;
                console.log('data.user.dateRequests.list: ', data.user.dateRequests.list);
                return data.user.dateRequests.list
                  .filter((date: any) => date.open)
                  .map((date: any) => (
                    <ListItem
                      key={date.id}
                      onPress={() => {
                        analytics.logEvent('Click_OpenDateList_DateClick');
                        return navigate('BidDate', {
                          date,
                          ...params,
                        });
                      }}
                    >
                      <View style={styles.listItemText}>
                        <MyAppText>{formatDate(date.datetimeOfDate)}</MyAppText>
                        <MyAppText>{formatDescription(date.description)}</MyAppText>
                      </View>
                    </ListItem>
                  ));
              }}
            </GetDates>
          </List>
        </Content>
      </Container>
    );
  }
}

interface Style {
  container: ViewStyle;
  textHeader: TextStyle;
  headerViewStyle: ViewStyle;
  listItemText: TextStyle;
}

// We put the styles in the component
const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: SECONDARY_WHITE,
  },
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
