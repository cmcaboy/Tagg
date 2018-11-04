import React from 'react';
import { StyleSheet } from 'react-native';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from './Button';
import { FOLLOW } from '../../apollo/mutations';

// const FollowButton = ({ id, followId, isFollowing }) => (
// );

class FollowButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFollowing: this.props.isFollowing,
    };
  }

  render() {
    const { isFollowing } = this.state;
    const { id, followId } = this.props;

    return (
      <Mutation mutation={FOLLOW} ignoreResults>
        {(follow, _) => {
          const updateFollow = (isFollowingParam) => {
            console.log('isFollowing: ', isFollowing);
            follow({
              variables: {
                id,
                followId,
                isFollowing: isFollowingParam,
              },
              optimisticResponse: {
                follow: {
                  id: followId,
                  isFollowing,
                  __typename: 'User',
                },
              },
              update: (store, data) => {
                this.setState({ isFollowing: isFollowingParam });
                console.log('updateFollow store: ', store);
                console.log('updateFollow data: ', data);
                const storeData = store.readFragment({
                  id: followId,
                  fragment: gql`
                    fragment User on User {
                      isFollowing
                    }
                  `,
                  // variables: {id:this.props.user.id},
                });
                // console.log('storeData: ',storeData);

                store.writeFragment({
                  id: followId,
                  fragment: gql`
                    fragment User on User {
                      isFollowing
                    }
                  `,
                  data: {
                    ...storeData,
                    isFollowing: data.data.follow.isFollowing,
                  },
                });

                // store.writeQuery({query: GET_QUEUE, data: storeData})
              },
            });
          };
          return isFollowing ? (
            <Button
              invertColors
              textStyle={styles.buttonText}
              onPress={() => updateFollow(!isFollowing)}
            >
              {'Following'}
            </Button>
          ) : (
            <Button
              buttonStyle={styles.buttonStyle}
              textStyle={styles.buttonText}
              onPress={() => updateFollow(!isFollowing)}
            >
              {'Follow'}
            </Button>
          );
        }}
      </Mutation>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: 10,
    minWidth: 70,
    // padding: 4,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
    padding: 4,
  },
});

export { FollowButton };
