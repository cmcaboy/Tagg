//const moment = require('moment');
import {moment} from 'moment';

export const createDatePushTitle = (name) => `${name} is looking for a date!`
export const createDatePushBody = (name, date) => `${name} is looking for a date at ${formatDate(date.datetimeOfDate)}. Hurry and bid on this date!`;
export const formatDate = (date) => moment(date).format('MMM D, h:mm a');
