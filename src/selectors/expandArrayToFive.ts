import { NUM_PHOTOS, PHOTO_ADD_URL } from '../variables';

export default (a: string[]) => {
  const b = [];
  if (a.length >= NUM_PHOTOS) {
    return a;
  }
  for (let i = 0; i < NUM_PHOTOS - 1; i += 1) {
    b[i] = a[i] ? a[i] : PHOTO_ADD_URL;
  }
  return b;
};
