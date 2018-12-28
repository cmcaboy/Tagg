import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from './Button';
import { FOLLOW } from '../../apollo/mutations';
import { follow, followVariables } from '../../apollo/mutations/__generated__/follow';
import { analytics } from '../../firebase';

class Follow extends Mutation<follow, followVariables> {}

interface State {
  isFollowing: boolean;
}

interface Props {
  id: string;
  followId: string;
  isFollowing: boolean;
}

class FollowButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isFollowing: this.props.isFollowing,
    };
  }

  render() {
    const { isFollowing } = this.state;
    const { id, followId } = this.props;

    return (
      <Follow mutation={FOLLOW} ignoreResults>
        {(follow, _) => {
          const updateFollow = (isFollowingParam: boolean) => {
            analytics.logEvent('Click_followButton_press');
            // console.log('isFollowing: ', isFollowing);
            follow({
              variables: {
                id,
                followId,
                isFollowing: isFollowingParam,
              },
              optimisticResponse: {
                follow: {
                  isFollowing,
                  id: followId,
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
              textStyle={styles.buttonText as TextStyle}
              onPress={() => updateFollow(!isFollowing)}
            >
              {'Following'}
            </Button>
          ) : (
            <Button
              buttonStyle={styles.buttonStyle as ViewStyle}
              textStyle={styles.buttonText as TextStyle}
              onPress={() => updateFollow(!isFollowing)}
            >
              {'Follow'}
            </Button>
          );
        }}
      </Follow>
    );
  }
}

interface Style {
  buttonStyle: ViewStyle;
  buttonText: TextStyle;
}

const styles = StyleSheet.create<Style>({
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
