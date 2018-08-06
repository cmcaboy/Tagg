import moment from 'moment';

export const DATE_FORMAT = 'MMM D, h:mm a';
export const formatDate = (date) => moment(date).format(DATE_FORMAT);
export const formatDescription = (desc) => desc.length > 20? `${desc.slice(0,20)}...`: desc;
export const formatBids = (num_bids) => num_bids === 1 ? `${num_bids} bid` : `${num_bids} bids`;