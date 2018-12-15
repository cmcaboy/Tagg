import React, { SFC } from 'react';
import { TouchableOpacity } from 'react-native';
import { Mutation } from 'react-apollo';
import { ActionSheet } from 'native-base';
import { DataProxy } from 'apollo-cache';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BLOCK_USER } from '../../apollo/mutations';
import { block, blockVariables } from '../../apollo/mutations/__generated__/block';
import { flag, flagVariables } from '../../apollo/mutations/__generated__/flag';
import ToastMessage from '../../services/toastMessage';
import { FLAG_AND_BLOCK_USER } from '../../apollo/mutations/index';
import { GET_QUEUE } from '../../apollo/queries/index';

class BlockUser extends Mutation<block, blockVariables> {}
class FlagUser extends Mutation<flag, flagVariables> {}

interface Props {
  id: string;
  name: string;
  hostId: string;
}

const FlagMenu: SFC<Props> = ({ id, hostId, name }) => {
  const BUTTONS = ['Report', 'Block', 'Report and Block', 'Cancel'];
  const REPORT_INDEX = 0;
  const BLOCK_INDEX = 1;
  const REPORT_AND_BLOCK_INDEX = 2;
  const CANCEL_INDEX = 3;

  const onCompleted = (data: any) => {
    console.log('onCompleted');
    // console.log('data: ', data);
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
    console.log('openMenu');
    ActionSheet.show(
      { options: BUTTONS, cancelButtonIndex: CANCEL_INDEX, title: name },
      (selectedIndex) => {
        console.log('selectedIndex: ', selectedIndex);
        switch (selectedIndex) {
          case BLOCK_INDEX:
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
                onCompleted(data);
              },
            });
            return;
          case REPORT_INDEX:
            console.log('REPORT_INDEX: ', REPORT_INDEX);
            flagUser({
              variables: { id: hostId, flaggedId: id },
              update: (_: any, data: any) => {
                console.log(`data: ${JSON.stringify(data)}`);
              },
            });
            return;
          case REPORT_AND_BLOCK_INDEX:
            // Should also remove from cache
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
              <MaterialCommunityIcons name="dots-vertical" size={14} />
            </TouchableOpacity>
          )}
        </FlagUser>
      )}
    </BlockUser>
  );
};

// const styles = StyleSheet.create({});

export default FlagMenu;
