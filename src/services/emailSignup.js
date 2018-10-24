import { auth } from '../firebase';
import { CHECK_EMAIL } from '../apollo/queries';

export default async ({ email, password }) => {
  console.log('Attempting to Signup');
  console.log('email: ', email);

  let signup = null;
  try {
    signup = await auth.createUserWithEmailAndPassword(email, password);
  } catch (e) {
    console.log('Error signing up via email: ', e);
    signup = false;
    return e.toString();
  }

  console.log('signup: ', signup);

  // If execution successful, return null.
  return null;
};
