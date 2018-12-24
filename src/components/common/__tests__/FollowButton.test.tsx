import React from 'react';

import { render } from 'react-native-testing-library';
import { FollowButton } from '../index';
import { TEST_ID, TEST_SECONDARY_ID } from '../../../tests/test-data';

// There are more things I could do with follow button, such as
// manipulate the followButton click if I so wanted to

describe('FollowButton', () => {
  it('default props renders without error', () => {
    render(<FollowButton id={TEST_ID} followId={TEST_SECONDARY_ID} isFollowing />);
  });

  it('isFollowing is false prop renders without error', () => {
    render(<FollowButton id={TEST_ID} followId={TEST_SECONDARY_ID} isFollowing={false} />);
  });
});
