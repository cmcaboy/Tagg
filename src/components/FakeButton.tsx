import React from 'react';
import { Button } from 'native-base';
import { Mutation } from 'react-apollo';
import fakeDateCreation from '../tests/fakeDataCreation';
import {
  NEW_USER, FOLLOW, BID, NEW_DATE, CHOOSE_WINNER,
} from '../apollo/mutations';
import { MyAppText } from './common';

export default () => (
  <Mutation mutation={NEW_USER}>
    {newUser => (
      <Mutation mutation={FOLLOW}>
        {follow => (
          <Mutation mutation={BID}>
            {bid => (
              <Mutation mutation={NEW_DATE}>
                {createDate => (
                  <Mutation mutation={CHOOSE_WINNER}>
                    {chooseWinner => (
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
                  </Mutation>
                )}
              </Mutation>
            )}
          </Mutation>
        )}
      </Mutation>
    )}
  </Mutation>
);
