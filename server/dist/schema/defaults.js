"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const format_1 = require("../middleware/format");
exports.newUserDefaults = {
    active: true,
    name: "",
    gender: "female",
    age: 25,
    description: "",
    school: "",
    work: "",
    sendNotifications: true,
    distance: 50,
    token: "",
    latitude: 40.0,
    longitude: -75.0,
    registerDateTime: format_1.getCurrentDateNeo(),
    minAgePreference: 18,
    maxAgePreference: 34,
    followerDisplay: "",
    objectionable: false,
    viewObjectionable: true,
    pics: []
};
//# sourceMappingURL=defaults.js.map