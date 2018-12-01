"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sensitive_1 = require("../sensitive");
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver(sensitive_1.NEO4J_URL, neo4j.auth.basic(sensitive_1.NEO4J_USER, sensitive_1.NEO4J_PASSWORD));
exports.driver = driver;
//# sourceMappingURL=neo4j.js.map