import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import SplashScreen from 'react-native-splash-screen';
import { Spinner, ErrorMessage } from './common';
import { GET_QUEUE, MORE_QUEUE } from '../apollo/queries';
// import { GET_ID } from '../apollo/local/queries';
import { SET_COORDS, SET_PUSH_TOKEN } from '../apollo/mutations';
import Stagg from './Stagg';
import EmptyList from './EmptyList';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
// import { getId } from '../apollo/queries/__generated__/getId';
import { setCoords, setCoordsVariables } from '../apollo/mutations/__generated__/setCoords';
import { setPushToken, setPushTokenVariables } from '../apollo/mutations/__generated__/setPushToken';
import { AsyncStorage } from 'react-native';
// import { getQueue, getQueueVariables } from '../apollo/queries/__generated__/getQueue';
// import { moreQueue, moreQueueVariables } from '../apollo/queries/__generated__/moreQueue';

interface Params {};

interface Props {
  navigation: NavigationScreenProp<NavigationRoute<Params>, Params>;
}

interface State {};

// class GetID extends Query<getId, {}> {};
// class GetQueue extends Query<getQueue | moreQueue, getQueueVariables | moreQueueVariables> {};
class GetQueue extends Query<any, any> {};
// set coords
class SetCoords extends Mutation<setCoords, setCoordsVariables> {};
// set push token
class SetPushToken extends Mutation<setPushToken, setPushTokenVariables> {};


class StaggContainer extends Component<Props, State> {
  componentDidMount = () => {
    const tempId = AsyncStorage.getItem("TaggToken");
    console.log('tempId: ', tempId);
    return SplashScreen.hide();
  }

  render() {
    const { navigation } = this.props;

    // return (
      // <GetID query={GET_ID}>
      //   {({ loading, error, data }) => {
      //     console.log('local data stagg: ', data);
      //     // console.log('local error stagg: ',error);
      //     // console.log('local loading stagg: ',loading);
      //     if (loading) return <Spinner />;
      //     if (error) return <ErrorMessage error={error.message} />;
      //     const { id }: { id: any } = data.user;
      //     if (id === "0" || id === 0) return <Spinner />;
          // if (id === 0) return <LoginButton onLogoutFinished={async () => firebase.auth().signOut()} />;
    return (
      <GetQueue query={GET_QUEUE} fetchPolicy="network-only" >
        {({ error, data, loading, fetchMore, networkStatus, refetch }) => {
          // console.log('data stagg: ', data);
          // console.log('error stagg: ',error);
          // console.log('loading stagg: ',loading);
          // console.log('networkStatus: ', networkStatus);
          switch (networkStatus) {
            case 1: return <Spinner />;
            case 2: return <Spinner />;
            case 4: return <Spinner />;
            default: console.log('no loading');
          }
          // if(networkStatus === 1) {
          //     return <Spinner />
          // } else if() {}
          // if(loading) return <Spinner />
          if (error) return <ErrorMessage error={error.message} refetch={refetch} />;
          const refetchQueue = () => {
            console.log('in refetchQueue');

            refetch();
          };
          if (!data.user) return <EmptyList refetch={refetchQueue} text="There is no one new in your area." subText="Try again later." />;
          const { followerDisplay, id } = data.user;
          const fetchMoreQueue = () => {
            console.log('in fetchMoreQueue');
            if (!data.user.queue) {
              console.log('queue empty or returning an error');
              return null;
            }
            console.log('cursor: ', data.user.queue.cursor);
            if (!data.user.queue.cursor && data.user.queue.cursor !== 0) {
              // If the cursor is null, don't call refetch because
              // you are at the end of the queue.
              console.log('You are at the end of the queue. There is nothing left to fetch.');
              return null;
            }
            return fetchMore({
              query: MORE_QUEUE,
              variables: { id, followerDisplay, cursor: data.user.queue.cursor },
              updateQuery: (prev, { fetchMoreResult }) => {
                console.log('fetchMore queue');
                // console.log('new queue: ', fetchMoreResult);
                // console.log('prev: ',prev);

                const newQueue = fetchMoreResult.moreQueue.list;
                const newCursor = fetchMoreResult.moreQueue.cursor;

                // console.log('oldList: ', prev.user.queue.list);
                // console.log('new addition: ', newQueue);

                // const newList = new Set([...prev.user.queue.list,...newQueue]);

                // console.log('newList: ',[...newList]);

                const result = {
                  user: {
                    ...prev.user,
                    queue: {
                      id: prev.user.queue.id,
                      list: [...prev.user.queue.list, ...newQueue],
                      cursor: newCursor,
                      __typename: 'Queue',
                    },
                  },
                };
                // console.log('moreQueue New Result: ', result);
                return result;
              },
            });
          };
          return (
            <SetCoords mutation={SET_COORDS}>
              {(setCoords) => {
                return (
                  <SetPushToken mutation={SET_PUSH_TOKEN}>
                    { ( setPushToken ) => {
                        const startSetCoords = (latitude: number, longitude: number) => setCoords({ variables: { id, latitude, longitude } });
                        const startSetPushToken = ( token: string ) => setPushToken({ variables: { id, token } });
                        return (
                          <Stagg
                            id={id}
                            queue={data.user.queue ? data.user.queue.list : []}
                            startSetCoords={startSetCoords}
                            startSetPushToken={startSetPushToken}
                            navigation={navigation}
                            fetchMoreQueue={fetchMoreQueue}
                            refetchQueue={refetchQueue}
                            pushToken={data.user.token}
                          />
                        );
                    } }
                    </SetPushToken>
                )
              }}
              </SetCoords>
          );
        }}
      </GetQueue>
    );
  }
}

export default StaggContainer;
