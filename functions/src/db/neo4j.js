"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://hobby-khdldknhlicigbkenklmdfal.dbs.graphenedb.com:24786', neo4j.auth.basic("test", "b.IZSvc43dQbXa.KMsEveqgk5PS1spd"));
exports.driver = driver;
