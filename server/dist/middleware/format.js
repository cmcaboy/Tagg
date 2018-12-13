"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require('moment');
exports.getCurrentDateNeo = () => moment().unix();
exports.getCurrentDateFirestore = () => new Date();
exports.convertDateToEpoch = (date) => moment(date).unix();
//# sourceMappingURL=format.js.map