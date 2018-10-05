import { auth } from '../firebase';

export default async ({ email, password, client, startSetId, startNewUser }) => {

  console.log('Attempting to Login');
  console.log('email: ', email);
  console.log('password: ', password);

  let login = null;

  // Attempt login
  try {
    login = await auth.signInAndRetrieveDataWithEmailAndPassword(email, password);
  } catch (e) {
    console.log('Error logging in: ', e);
    login = false;
  }

  console.log('login: ', login);

  // If login does not work, attempt to sign the user up
  if (!login) {
    let signup = null;
    try {
      signup = await auth.createUserAndRetrieveDataWithEmailAndPassword(email, password);
    } catch (e) {
      console.log('Error signing up via email: ', e);
      signup = false;
      return e;
    }

    console.log('signup: ', signup);
  }

  startSetId(email);
  // If execution successful, return null.
  return null;
};
