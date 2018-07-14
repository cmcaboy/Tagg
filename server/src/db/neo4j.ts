import {NEO4J_USER,NEO4J_PASSWORD,NEO4J_URL} from '../sensitive';
const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver(NEO4J_URL,neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

export {driver};