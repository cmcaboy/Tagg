import moment from 'moment';

export const DATE_FORMAT = 'MMM D, h:mm a';
export const DAY_FORMAT = 'MMM D';

// export const formatDate = date => moment(date).format(DATE_FORMAT);
// export const formatDay = date => moment(date).format(DAY_FORMAT);
// export const getCurrentTime = () => new Date().getTime();

export const formatDescription = desc => (desc.length > 20 ? `${desc.slice(0, 20)}...` : desc);
export const formatName = name => (name.length > 15 ? `${name.slice(0, 15)}...` : name);
export const formatBids = numBids => (numBids === 1 ? `${numBids} bid` : `${numBids} bids`);
export const formatDistanceApart = d => `${Math.round(d)} ${Math.round(d) === 1 ? ' mile away' : ' miles away'}`;

// New time formats

export const getCurrentTime = () => moment().unix(); // returns seconds since epoch
export const formatDate = date => moment.unix(date).format(DATE_FORMAT);
export const formatDay = date => moment.unix(date).format(DAY_FORMAT);
export const convertDateToEpoch = date => moment().unix(date);
