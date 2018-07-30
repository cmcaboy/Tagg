import moment from 'moment';

export const formatDate = (date) => moment(date).format('MMM D, h:mm a');
export const formatDescription = (desc) => desc.length > 20? `${desc.slice(0,20)}...`: desc;
export const formatBids = (num_bids) => num_bids === 1 ? `${num_bids} bid` : `${num_bids} bids`;