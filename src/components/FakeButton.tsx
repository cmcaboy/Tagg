import React from 'react';
import Composer from 'react-composer';
import { Button } from 'native-base';
import { Mutation } from 'react-apollo';
import fakeDateCreation from '../tests/fakeDataCreation';
import {
  NEW_USER, FOLLOW, BID, NEW_DATE, CHOOSE_WINNER,
} from '../apollo/mutations';
import { MyAppText } from './common';

export default () => (
  <Composer
    components={[
      <Mutation mutation={NEW_USER} />,
      <Mutation mutation={FOLLOW} />,
      <Mutation mutation={BID} />,
      <Mutation mutation={NEW_DATE} />,
      <Mutation mutation={CHOOSE_WINNER} />,
    ]}
  >
    {([newUser, follow, bid, createDate, chooseWinner]) => (
      <Button
        block
        onPress={() => fakeDateCreation({
          newUser,
          follow,
          bid,
          createDate,
          chooseWinner,
        })
        }
      >
        <MyAppText style={{ color: 'white' }}>Create Test Data</MyAppText>
      </Button>
    )}
  </Composer>
);
