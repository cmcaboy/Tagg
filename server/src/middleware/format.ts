const moment = require("moment");

export const getCurrentDateNeo = (): any => moment().unix();
export const getCurrentDateFirestore = (): any => new Date();
