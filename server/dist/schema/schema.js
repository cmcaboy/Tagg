"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const context = ({ req }) => __awaiter(this, void 0, void 0, function* () {
    const auth = (req.headers && req.headers.authorization) || '';
    console.log('auth: ', auth);
    const email = auth;
    let neoRaw;
    let user;
    if (!email) {
        console.log('No email in header!');
        return { user: null };
    }
    try {
        neoRaw = yield session.run(`MATCH (a:User{id:'${email}'}) RETURN a.id, a.email, a.token, a.roles`);
        user = {
            id: neoRaw.records[0]._fields[0],
            email: neoRaw.records[0]._fields[1],
            token: neoRaw.records[0]._fields[2],
            roles: neoRaw.records[0]._fields[3],
        };
    }
    catch (e) {
        console.log(`Error retreiving user ${email} from database: ${e}`);
        return { user: null };
    }
    return { user };
});
exports.server = {
    typeDefs: typeDefs_1.default,
    resolvers: index_1.resolvers,
    playground,
    context,
    dataSources,
    engine: {
        apiKey: 'service:cmcaboy-2497:fJtoyV5uQQfIQ0I11WiXqg',
    },
};
exports.default = new ApolloServer(exports.server);
//# sourceMappingURL=schema.js.map