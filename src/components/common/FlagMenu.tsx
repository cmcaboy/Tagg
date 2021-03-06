import React, { SFC } from 'react';
import { TouchableOpacity } from 'react-native';
import { Mutation } from 'react-apollo';
import { ActionSheet } from 'native-base';
import { DataProxy } from 'apollo-cache';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {
//   // withNavigation,
//   NavigationInjectedProps,
//   NavigationScreenProp,
//   NavigationRoute,
// } from 'react-navigation';
import { BLOCK_USER } from '../../apollo/mutations';
import { block, blockVariables } from '../../apollo/mutations/__generated__/block';
import { flag, flagVariables } from '../../apollo/mutations/__generated__/flag';
import ToastMessage from '../../services/toastMessage';
import { FLAG_AND_BLOCK_USER } from '../../apollo/mutations/index';
import { GET_QUEUE, GET_MATCHES } from '../../apollo/queries/index';
import { analytics } from '../../firebase';

class BlockUser extends Mutation<block, blockVariables> {}
class FlagUser extends Mutation<flag, flagVariables> {}

interface Props {
  id: string;
  name: string;
  hostId: string;
  size?: number;
  // navigation: NavigationScreenProp<NavigationRoute<{}>, {}>;
  navigation: any;
  inProfile?: boolean; // true if user is in UserProfile or Messenger
  // If true, we will go back 1 item in the stack navigation
  // This is used if the user blocks the user in question.
}

const FlagMenu: SFC<Props> = ({
  id,
  hostId,
  name,
  size = 14,
  navigation,
  // navigation: { goBack = () => {} },
  inProfile = false,
}) => {
  const BUTTONS = ['Report', 'Block', 'Report and Block', 'Cancel'];
  const REPORT_INDEX = 0;
  const BLOCK_INDEX = 1;
  const REPORT_AND_BLOCK_INDEX = 2;
  const CANCEL_INDEX = 3;

  // console.log('navigation: ', navigation);
  const onCompleted = (data: any) => {
    console.log('onCompleted');
    // console.log('data: ', data);

    // If operation involves block and the user is in the UserProfile or
    // Messenger component, navigate 1 directory back.
    // We may need to implement a more robust solution.
    if (!data.flag && inProfile) {
      navigation.goBack();
    }
    const text = data.flag
      ? `Thank you for reporting ${name}. We will investigate.`
      : `${name} has been blocked.`;
    return ToastMessage({
      text,
      duration: 5000,
      buttonText: 'Okay',
    });
  };

  const onError = (_: any) => {
    // console.log('data: ', data);
    console.log('onError');
    const text = 'Sorry! Something with wrong! Please try again soon';
    return ToastMessage({
      text,
      duration: 5000,
      buttonText: 'Okay',
    });
  };

  const openMenu = ({
    blockUser,
    flagUser,
  }: {
  blockUser: (options: any) => void;
  flagUser: (options: any) => void;
  }) => {
    analytics.logEvent('Click_FlagMenu_open');
    console.log('openMenu');
    ActionSheet.show(
      { options: BUTTONS, cancelButtonIndex: CANCEL_INDEX, title: name },
      (selectedIndex) => {
        console.log('selectedIndex: ', selectedIndex);
        switch (selectedIndex) {
          case BLOCK_INDEX:
            analytics.logEvent('Click_FlagMenu_block');
            console.log('BLOCK_INDEX: ', BLOCK_INDEX);
            // Should also remove from cache
            blockUser({
              variables: { id: hostId, blockedId: id },
              update: async (cache: DataProxy, data: any) => {
                // console.log(`data: ${JSON.stringify(data)}`);
                // console.log(`data.block: ${data.block}`);
                const {
                  user,
                  user: {
                    queue,
                    queue: { list },
                  },
                } = cache.readQuery({ query: GET_QUEUE });
                // console.log('user: ', user);
                // console.log('queue: ', list);
                // Write the list back to the cache without the blocked user
                cache.writeQuery({
                  query: GET_QUEUE,
                  data: {
                    user: {
                      ...user,
                      queue: {
                        ...queue,
                        list: list.filter((user: any) => user.id !== data.data.block.id),
                      },
                    },
                  },
                });
                // Remove user from dateRequests and matchedDates queues if applicable
                const {
                  user: userMatches,
                  user: {
                    matchedDates,
                    matchedDates: { list: matchList },
                    dateRequests,
                  },
                } = cache.readQuery({ query: GET_MATCHES });

                cache.writeQuery({
                  query: GET_MATCHES,
                  data: {
                    user: {
                      ...userMatches,
                      dateRequests: {
                        ...dateRequests,
                      },
                      matchedDates: {
                        ...matchedDates,
                        list: matchList.filter((date: any) => date.user.id !== data.data.flag.id),
                      },
                    },
                  },
                });
                onCompleted(data);
              },
            });
            return;
          case REPORT_INDEX:
            analytics.logEvent('Click_FlagMenu_report');
            console.log('REPORT_INDEX: ', REPORT_INDEX);
            flagUser({
              variables: { id: hostId, flaggedId: id },
              update: (_: any, data: any) => {
                // viewObjectionable should be updated in the cache
                // automatically; May need to check. I could also
                // check the cache to see if the user has the viewObjectionable
                // option turned on. If it is, I should hide the current user.
                console.log(`data: ${JSON.stringify(data)}`);
              },
            });
            return;
          case REPORT_AND_BLOCK_INDEX:
            analytics.logEvent('Click_FlagMenu_report_and_block');
            flagUser({
              variables: { id: hostId, flaggedId: id, block: true },
              update: (cache: DataProxy, data: any) => {
                const {
                  user,
                  user: {
                    queue,
                    queue: { list },
                  },
                } = cache.readQuery({ query: GET_QUEUE });
                console.log('data: ', data);
                console.log('user: ', user);
                // Write the list back to the cache without the blocked user
                cache.writeQuery({
                  query: GET_QUEUE,
                  data: {
                    user: {
                      ...user,
                      queue: {
                        ...queue,
                        list: list.filter((user: any) => user.id !== data.data.flag.id),
                      },
                    },
                  },
                });

                // Remove user from dateRequests and matchedDates queues if applicable
                // This is done in chooseWinner via BidList
                const {
                  user: userMatches,
                  user: {
                    matchedDates,
                    matchedDates: { list: matchList },
                    dateRequests,
                  },
                } = cache.readQuery({ query: GET_MATCHES });

                // Remove entry from dateRequest and matchedDates list in cache
                cache.writeQuery({
                  query: GET_MATCHES,
                  data: {
                    user: {
                      ...userMatches,
                      dateRequests: {
                        ...dateRequests,
                      },
                      matchedDates: {
                        ...matchedDates,
                        list: matchList.filter((date: any) => date.user.id !== data.data.flag.id),
                      },
                    },
                  },
                });

                onCompleted(data);
              },
            });
        }
      },
    );
  };

  return (
    <BlockUser mutation={BLOCK_USER} onCompleted={onCompleted} onError={onError}>
      {blockUser => (
        <FlagUser mutation={FLAG_AND_BLOCK_USER} onCompleted={onCompleted} onError={onError}>
          {flagUser => (
            <TouchableOpacity onPress={() => openMenu({ blockUser, flagUser })}>
              <MaterialCommunityIcons name="dots-vertical" size={size} />
            </TouchableOpacity>
          )}
        </FlagUser>
      )}
    </BlockUser>
  );
};

// const styles = StyleSheet.create({});

export default FlagMenu;
