import ENV from './index';

export const FUNCTION_PATH = (ENV === "PROD") ?
    'https://us-central1-manhattanmatch-9f9fe.cloudfunctions.net'
    :
    'https://us-central1-manhattanmatch-9f9fe.cloudfunctions.net';
