import Config from 'react-native-config';

export const ENV = 'PROD';

export const {
  PHOTO_ADD_URL,
  GOOGLE_MAPS_API_KEY,
  GRAPHQL_SERVER,
  GRAPHQL_SERVER_WS,
  GEO_LOCATION_URL,
  PLACEHOLDER_PHOTO,
} = Config;

export const NUM_PHOTOS = 6;
export const TAB_BAR_HEIGHT = 56;

export const PRIMARY_COLOR = '#03A9F4';
export const SECONDARY_COLOR = '#02FCED';
export const STATUS_BAR_COLOR = '#81D4FA';
export const BACKGROUND_COLOR = '#FFF';

export const CARD_HEIGHT = 120;
export const CARD_FOOTER_HEIGHT = 35;
export const CARD_MARGIN = 7;
export const PICTURE_WIDTH = 100;

export const PHOTO_HINT = 'Hint: Press 2 photos to switch the position of the photos. Press and hold a photo to upload a new photo';
export const PROFILE_NOT_FOUND = 'We could not find your profile.';

export const DEFAULT_LATITUDE = 40.000;
export const DEFAULT_LONGITUDE = -75.000;
