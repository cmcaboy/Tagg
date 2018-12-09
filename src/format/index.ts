import moment from 'moment';

export const DATE_FORMAT = 'MMM D YYYY, h:mm a';
export const DAY_FORMAT = 'MMM D';

// export const formatDate = date => moment(date).format(DATE_FORMAT);
// export const formatDay = date => moment(date).format(DAY_FORMAT);
// export const getCurrentTime = () => new Date().getTime();

export const formatDescription = (desc: string) => {
  if (!desc) {
    return '';
  }
  return desc.length > 20 ? `${desc.slice(0, 20)}...` : desc;
};
export const formatName = (name: string) => (name.length > 25 ? `${name.slice(0, 25)}...` : name);
export const formatSchool = (a: string) => (a.length > 40 ? `${a.slice(0, 40)}...` : a);
export const formatWork = (a: string) => (a.length > 40 ? `${a.slice(0, 40)}...` : a);
export const formatBids = (numBids: number) => (numBids === 1 ? `${numBids} bid` : `${numBids} bids`);
export const formatDistanceApart = (d: number) => `${Math.round(d)} ${Math.round(d) === 1 ? ' mile away' : ' miles away'}`;

// New time formats

export const getCurrentTime = () => moment().unix(); // returns seconds since epoch
export const formatDate = (date: number) => moment.unix(date).format(DATE_FORMAT);
export const formatDay = (date: any) => moment.unix(date).format(DAY_FORMAT);
// export const convertDateToEpoch = (date: any) => date.moment().unix();
export const convertDateToEpoch = (date: any) => moment(date).unix();
