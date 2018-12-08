import uuid from 'uuid';
import { firebase } from './index';
import { FUNCTION_PATH } from '../variables/functions';

export default async (uri: String | Blob, name = uuid()) => {
  console.log('uri: ', uri);
  const body = new FormData();
  body.append('picture', {
    uri,
    name,
    type: 'image/jpg',
  });

  try {
    const res = await fetch(`${FUNCTION_PATH}/api/picture`, {
      method: 'POST',
      body,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Message uploaded response: ', res);
  } catch (e) {
    console.log('Error uploading photo: ', e);
  }
  console.log('name: ', name);
  const url = await firebase
    .storage()
    .ref(name)
    .getDownloadURL();
  console.log('url: ', url);
  return url;
};
