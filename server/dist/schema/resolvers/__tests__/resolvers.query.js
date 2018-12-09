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
const queries_1 = require("../../../clientGQL/queries");
const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server-express');
const TEST_ID = 'cory.mcaboy@gmail.com';
describe('Query.user', () => {
    const testServer = new ApolloServer(Object.assign({}, schema_1.server, { context: () => ({
            user: {
                id: TEST_ID,
                email: TEST_ID,
            },
        }), engine: null }));
    const { query } = createTestClient(testServer);
    jest.setTimeout(10000);
    it('GET_QUEUE no params', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_QUEUE });
        expect(res).toMatchSnapshot();
    }));
    it(`GET_QUEUE id: ${TEST_ID}`, () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_QUEUE, variables: { id: TEST_ID } });
        expect(res).toMatchSnapshot();
    }));
    it(`GET_DATES id: ${TEST_ID}`, () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_DATES, variables: { id: TEST_ID } });
        expect(res).toMatchSnapshot();
    }));
    it('GET_DATES', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_DATES });
        expect(res).toMatchSnapshot();
    }));
    it('GET_BIDS no params', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_BIDS });
        expect(res).toMatchSnapshot();
    }));
    it(`GET_BIDS id: ${TEST_ID}`, () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_BIDS, variables: { id: TEST_ID } });
        expect(res).toMatchSnapshot();
    }));
    it('GET_USER_PROFILE no params', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_USER_PROFILE });
        expect(res).toMatchSnapshot();
    }));
    it(`GET_USER_PROFILE id: ${TEST_ID}`, () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_USER_PROFILE, variablesL: { id: TEST_ID } });
        expect(res).toMatchSnapshot();
    }));
    it(`GET_MATCHES id: ${TEST_ID}`, () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_MATCHES, variables: { id: TEST_ID } });
        expect(res).toMatchSnapshot();
    }));
    it('GET_MATCHES no params', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_MATCHES });
        expect(res).toMatchSnapshot();
    }));
    it('GET_SETTINGS no params', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_SETTINGS });
        expect(res).toMatchSnapshot();
    }));
    it(`GET_SETTINGS id: ${TEST_ID}`, () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_SETTINGS, variables: { id: TEST_ID } });
        expect(res).toMatchSnapshot();
    }));
    it('GET_EDIT_PROFILE no params', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_EDIT_PROFILE });
        expect(res).toMatchSnapshot();
    }));
    it(`GET_EDIT_PROFILE id: ${TEST_ID}`, () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_SETTINGS, variables: { id: TEST_ID } });
        expect(res).toMatchSnapshot();
    }));
    it(`CHECK_EMAIL id: ${TEST_ID}`, () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.CHECK_EMAIL, variables: { id: TEST_ID } });
        expect(res).toMatchSnapshot();
    }));
    it('CHECK_EMAIL no params', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.CHECK_EMAIL });
        expect(res).toMatchSnapshot();
    }));
});
describe('Query.otherBids', () => {
    const testServer = new ApolloServer(Object.assign({}, schema_1.server, { context: () => ({
            user: {
                id: TEST_ID,
                email: TEST_ID,
            },
        }) }));
    const { query } = createTestClient(testServer);
    it('GET_BIDS no params', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_BIDS });
        expect(res).toMatchSnapshot();
    }));
    it(`GET_BIDS id: ${TEST_ID}`, () => __awaiter(this, void 0, void 0, function* () {
        const res = yield query({ query: queries_1.GET_BIDS, variables: { id: TEST_ID } });
        expect(res).toMatchSnapshot();
    }));
});
//# sourceMappingURL=resolvers.query.js.map