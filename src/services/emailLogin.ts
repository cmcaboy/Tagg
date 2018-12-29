import { AsyncStorage } from 'react-native';
import { auth } from '../firebase';

// This function attempts to login via Firebase email auth
export default async ({
  email,
  password,
}: // startSetId, // replaced with asyncstorage
{
email: string;
password: string;
// startSetId: any; // replae with asyncstorage
}) => {
  console.log('Attempting to Login');

  let login = null;

  // Set ID in cache anticipating logic success
  // As soon as the user is authenticated, it will try to fetch data from the server
  // Therefore, it is better to set the ID prior to attempting the authentication.
  // If the authentication fails, simply catch the error and reset the ID back to 0.
  // startSetId(email);
  // console.log('email login attempt: ', email);
  await AsyncStorage.setItem('TaggToken', email);

  // Attempt login
  try {
    login = await auth.signInWithEmailAndPassword(email, password);
  } catch (e) {
    // If authentication fails, reset the id back to 0.
    console.log('Error logging in: ', e);
    login = false;
    // startSetId(0); // replace with asyncstorage
    await AsyncStorage.setItem('TaggToken', '0');
    return 'Invalid username and password combination. Please try again.';
  }

  // console.log('email login successful; token should be: ', email);
  console.log('login successful: ', login);

  // If execution successful, return null.
  return null;
};
