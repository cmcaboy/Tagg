"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
const typeDefs_1 = require("./typeDefs");
const resolvers_1 = require("./resolvers");
exports.default = graphql_tools_1.makeExecutableSchema({
    typeDefs: typeDefs_1.default,
    resolvers: resolvers_1.default
});
//# sourceMappingURL=schema.js.map