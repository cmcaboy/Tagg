import { CHECK_EMAIL } from '../apollo/queries';

export default async ({ email, client }: { email: string; client: any }) => {
  // returns true if email exists in our database, false if it doesn't
  console.log('Attempting to Signup');
  console.log('email: ', email);

  // Check to see if email exists
  try {
    const { data } = await client.query({ query: CHECK_EMAIL, variables: { id: email } });

    console.log('checkEmail data: ', data);
    if (!!data.user && data.user.email) {
      console.log('Email exists');
      // If the email exists, return true
      return true;
    }
  } catch (e) {
    // If there was an error trying to retreive the email, return false.
    console.log('Error: checking email: ', e);
    return false;
  }

  // If it does not exist, return null
  return false;
};
