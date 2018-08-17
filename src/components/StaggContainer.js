import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import Composer from 'react-composer';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { firebase } from '../firebase';
import { Spinner, ErrorMessage } from './common';
import { GET_QUEUE, MORE_QUEUE } from '../apollo/queries';
import { GET_ID } from '../apollo/local/queries';
import { SET_COORDS, SET_PUSH_TOKEN } from '../apollo/mutations';
import Stagg from './Stagg';

class StaggContainer extends Component {
  componentDidMount = () => {
    console.log('staggContainer didMount');
  }

  render() {
    const { navigation } = this.props;
    console.log('stag container');
    return (
      <Query query={GET_ID}>
        {({ loading, error, data }) => {
        console.log('local data stagg: ', data);
        // console.log('local error stagg: ',error);
        // console.log('local loading stagg: ',loading);
        if (loading) return <Spinner />;
        if (error) return <ErrorMessage error={error.message} />;
        const { id } = data.user;
        if (id === 0) return <Spinner />;
        // if (id === 0) return <LoginButton onLogoutFinished={async () => firebase.auth().signOut()} />;
        return (
          <Query query={GET_QUEUE} variables={{ id }}>
            {({ loading, error, data, fetchMore, networkStatus, refetch }) => {
              // console.log('data stagg: ',data);
              // console.log('error stagg: ',error);
              // console.log('loading stagg: ',loading);
              console.log('networkStatus: ', networkStatus);
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
              if (error) return <ErrorMessage error={error.message} />;
              const { followerDisplay } = data.user;
              // console.log('followerDisplay: ',followerDisplay);
              const refetchQueue = () => {
                console.log('in refetchQueue');

                refetch();
              };
              const fetchMoreQueue = () => {
                  console.log('in fetchMoreQueue');
                  if (!data.user.queue) {
                    console.log('queue empty or returning an error');
                    return null;
                  }
                  if (!data.user.queue.cursor) {
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
                      console.log('new queue: ', fetchMoreResult);
                      // console.log('prev: ',prev);

                      const newQueue = fetchMoreResult.moreQueue.list;
                      const newCursor = fetchMoreResult.moreQueue.cursor;

                      console.log('oldList: ', prev.user.queue.list);
                      console.log('new addition: ', newQueue);

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
                      console.log('moreQueue New Result: ', result);
                      return result;
                    },
                  });
              };
              return (
                <Composer
                  components={[
                    <Mutation mutation={SET_COORDS} />,
                    <Mutation mutation={SET_PUSH_TOKEN} />,
                  ]}
                >
                  {([setCoords, setPushToken]) => {
                    const startSetCoords = (lat, lon) => setCoords({ variables: { id, lat, lon } });
                    const startSetPushToken = token => setPushToken({ variables: { id, token } });
                    console.log('above stagg');
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
                  }}
                </Composer>
              );
            }}
          </Query>
          );
        }}
      </Query>
    );
  }
}

export default StaggContainer;
