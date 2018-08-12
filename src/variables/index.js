export const ENV = 'PROD'; 

export const PHOTO_ADD_URL = (ENV === 'PROD')?
'https://firebasestorage.googleapis.com/v0/b/stagg-cc356.appspot.com/o/icons%2Fadd_pic.png?alt=media&token=8150e06c-5dce-408a-b2a5-bda2edd35131'
:
'https://firebasestorage.googleapis.com/v0/b/stagg-test.appspot.com/o/add_pic.png?alt=media&token=5328312a-bd1a-4328-b355-2c80210b96ed'



export const NUM_PHOTOS = 6;
export const TAB_BAR_HEIGHT = 56;
export const PLACEHOLDER_PHOTO = "https://firebasestorage.googleapis.com/v0/b/stagg-cc356.appspot.com/o/icons%2Fstagg_512.png?alt=media&token=fab7e588-a23d-4a7d-8183-6f33c653ac18"
export const GOOGLE_MAPS_API_KEY = 'AIzaSyAlVUE0QmItEkmjVUBLhkb3ShhebQMJUdA';

export const PRIMARY_COLOR = '#F56705';
export const SECONDARY_COLOR = '#02FCED';
export const STATUS_BAR_COLOR = '#000';
export const BACKGROUND_COLOR = '#000';

export const GRAPHQL_SERVER = 'http://35.199.37.151:4000';

export const CARD_HEIGHT = 135;
export const CARD_FOOTER_HEIGHT = 35;
export const CARD_MARGIN = 7;

export const PHOTO_HINT = 'Hint: Press 2 photos to switch the position of the photos. Press and hold a photo to upload a new photo';
