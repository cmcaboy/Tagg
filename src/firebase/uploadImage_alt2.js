import {firebase} from './index.js';
import uuid from 'uuid';

const uploadImage = (uri, imageName = uuid()) => {
  console.log('upload Image uri: ',uri);
  console.log('image name: ',imageName);
  console.log(`firebase debug: ${firebase.storage.Native.DOCUMENT_DIRECTORY_PATH}`)

  return firebase.storage()
    .ref('pictures').child(imageName)
    .putFile(uri)
    .then((success) => {
        console.log('successful image upload: ',success);
        console.log('download url: ',success.downloadURL);
        return success.downloadURL;
    })
    .catch(e => console.log('Error uploading image: ',e))

}
export {uploadImage}