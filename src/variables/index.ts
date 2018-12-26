import Config from 'react-native-config';
import { Dimensions } from 'react-native';

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
// export const PRIMARY_COLOR = 'red';
export const SECONDARY_COLOR = '#FFFF00';
export const STATUS_BAR_COLOR = '#81D4FA';
export const BACKGROUND_COLOR = '#FFF';

export const CARD_HEIGHT = 120;
export const CARD_FOOTER_HEIGHT = 35;
export const CARD_MARGIN = 7;
export const PICTURE_WIDTH = 100;

export const PHOTO_HINT = 'Hint: Press 2 photos to switch the position of the photos. Press and hold a photo to upload a new photo';
export const PROFILE_NOT_FOUND = 'We could not find your profile.';

export const DEFAULT_LATITUDE = 40.0;
export const DEFAULT_LONGITUDE = -75.0;

export const ICON_OPACITY = 0.75;
export const ICON_SIZE = Dimensions.get('window').height * 0.05;

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const settingDefaults = {
  // latitude: DEFAULT_LATITUDE,
  // longitude: DEFAULT_LONGITUDE,
  sendNotifications: true,
  distance: 15,
  minAgePreference: 18,
  maxAgePreference: 28,
  followerDisplay: 'Both',
};

export const EMAIL_REGEX = RegExp(
  /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i,
);
