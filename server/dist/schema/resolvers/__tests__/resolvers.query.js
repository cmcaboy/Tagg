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
const schema_1 = require("../../schema");
const { createTestClient } = require('apollo-server-testing');
const { ApolloServer, gql } = require('apollo-server-express');
const BASIC_QUERY = gql `
  query user {
    id
    name
    work
  }
`;
describe('User query', () => {
    const testServer = new ApolloServer(Object.assign({}, schema_1.server, { context: {
            user: {
                id: 'cory.mcaboy@gmail.com',
                email: 'cory.mcaboy@gmail.com',
            },
        } }));
    const { query } = createTestClient(testServer);
    it('Basic user query', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: BASIC_QUERY });
        expect(res).toMatchSnapshot();
    }));
});
//# sourceMappingURL=resolvers.query.js.map