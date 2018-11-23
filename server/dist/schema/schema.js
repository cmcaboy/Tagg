"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeDefs_1 = require("./typeDefs");
const index_1 = require("./resolvers/index");
const neo_1 = require("./datasources/neo");
const firestore_1 = require("./datasources/firestore");
const neo4j_1 = require("../db/neo4j");
const firestore_2 = require("../db/firestore");
const { ApolloServer } = require('apollo-server-express');
const playground = {
    settings: {
        'editor.cursorShape': 'line',
    },
};
const session = neo4j_1.driver.session();
const dataSources = () => ({
    neoAPI: new neo_1.default({ session }),
    firestoreAPI: new firestore_1.default({ db: firestore_2.db }),
});
exports.default = new ApolloServer({
    typeDefs: typeDefs_1.default,
    resolvers: index_1.resolvers,
    playground,
    dataSources,
    engine: {
        apiKey: 'service:cmcaboy-2497:fJtoyV5uQQfIQ0I11WiXqg',
    },
});
//# sourceMappingURL=schema.js.map