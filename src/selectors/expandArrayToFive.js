import {NUM_PHOTOS,PHOTO_ADD_URL} from '../variables'

export default (a) => {
  let b = [];
  if (a.length >= NUM_PHOTOS) {
    return a;
  } else {
    //console.log('a: ',a);
    for(i = 0; i < NUM_PHOTOS - 1; i++) {
      b[i] = a[i]? a[i] : PHOTO_ADD_URL;
    }
    //console.log('b: ',b);
    return b;
  }
}