const moment = require("moment");

export const getCurrentDateNeo = () => moment().unix();
export const getCurrentDateFirestore = () => new Date();
