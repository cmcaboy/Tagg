"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ApolloServer } = require("apollo-server");
const typeDefs_1 = require("./typeDefs");
const resolvers_1 = require("./resolvers");
exports.default = new ApolloServer({
    typeDefs: typeDefs_1.default,
    resolvers: resolvers_1.default
});
//# sourceMappingURL=schema.js.map