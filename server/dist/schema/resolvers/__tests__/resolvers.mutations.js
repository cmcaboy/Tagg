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
const defaults_1 = require("../../defaults");
const mutation_1 = require("../../../clientGQL/mutation");
const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server-express');
const TEST_ID = 'cory.mcaboy@gmail.com';
let DATE_ID = '';
const TEST_MESSAGE = {
    name: 'Cory McAboy',
    text: 'Hey, how are you?',
    createdAt: '10/01/2019',
    avatar: 'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/0a7a7fdb-39d9-484d-9b24-80fa0ef66240?alt=media&token=a79482d1-44f5-46be-87a2-56bce9340b89',
    order: 189342789,
    uid: 'testUser@test.com',
    _id: '3429048jfksdjlk342',
};
const TEST_USER = Object.assign({}, defaults_1.newUserDefaults, { id: 'testuser@test.com', name: 'John Smith', email: 'testuser@test.com', token: '1234567890abc', pics: [
        'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/0a7a7fdb-39d9-484d-9b24-80fa0ef66240?alt=media&token=a79482d1-44f5-46be-87a2-56bce9340b89',
        'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/04f85f3e-63f5-4231-89dd-a45f94e96fa7?alt=media&token=6de58f19-1b2d-4041-8451-beff7287bf38',
        'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/0522af5a-8f39-42b1-a1ca-6e7b3e5eaf87?alt=media&token=e9bfda10-0600-41d2-a848-35a19cc26ec8',
        'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/0a7a7fdb-39d9-484d-9b24-80fa0ef66240?alt=media&token=a79482d1-44f5-46be-87a2-56bce9340b89',
        'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/0415e065-c80c-44b5-b469-4c6370804423?alt=media&token=86cf1038-8d6e-425c-90ef-b80ee999d29b',
        'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/0a7a7fdb-39d9-484d-9b24-80fa0ef66240?alt=media&token=a79482d1-44f5-46be-87a2-56bce9340b89',
    ] });
describe('Mutation ', () => {
    const testServer = new ApolloServer(Object.assign({}, schema_1.server, { context: () => ({
            user: {
                id: TEST_ID,
                email: TEST_ID,
            },
        }), engine: null }));
    const { mutate } = createTestClient(testServer);
    it('NEW_USER', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield mutate({ mutation: mutation_1.NEW_USER, variables: Object.assign({}, TEST_USER) });
        expect(res).toMatchSnapshot();
    }));
    it('NEW_DATE', () => __awaiter(this, void 0, void 0, function* () {
        const datetimeOfDate = 'May 7, 2019 10:00:00';
        const description = 'Looking for a walk of the beach';
        const res = yield mutate({
            mutation: mutation_1.NEW_DATE,
            variables: {
                id: TEST_USER.id,
                datetimeOfDate,
                description,
            },
        });
        DATE_ID = res.data.createDate.id;
        expect(res.data.createDate).toMatchSnapshot({
            creationTime: expect.any(String),
            datetimeOfDate,
            description,
            id: expect.any(String),
        });
        console.log('DATE_ID NEW_DATE: ', res.data.createDate.id);
    }));
    it('BID', () => __awaiter(this, void 0, void 0, function* () {
        const bidDescription = 'Looking for a walk of the beach';
        const bidPlace = 'Harrys pub';
        const res = yield mutate({
            mutation: mutation_1.BID,
            variables: {
                id: TEST_ID,
                dateId: DATE_ID,
                bidPlace,
                bidDescription,
            },
        });
        expect(res.data.bid).toMatchSnapshot({
            bidDescription,
            bidPlace,
            date: {
                id: expect.any(String),
                num_bids: expect.any(Number),
            },
            datetimeOfBid: expect.any(String),
            id: expect.any(String),
        });
    }));
    it('SET_COORDS', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield mutate({
            mutation: mutation_1.SET_COORDS,
            variables: {
                id: TEST_USER.id,
                latitude: 85.0,
                longitude: -35.0,
            },
        });
        expect(res).toMatchSnapshot();
    }));
    it('SET_PUSH_TOKEN', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield mutate({
            mutation: mutation_1.SET_PUSH_TOKEN,
            variables: {
                id: TEST_USER.id,
                token: '12345',
            },
        });
        expect(res).toMatchSnapshot();
    }));
    it('CHOOSE_WINNER', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield mutate({
            mutation: mutation_1.CHOOSE_WINNER,
            variables: {
                id: TEST_USER.id,
                winnerId: TEST_ID,
                dateId: DATE_ID,
            },
        });
        expect(res.data.chooseWinner).toMatchSnapshot({
            id: expect.any(String),
            open: false,
        });
    }));
    it('FOLLOW', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield mutate({
            mutation: mutation_1.FOLLOW,
            variables: {
                id: TEST_USER.id,
                followId: TEST_ID,
                isFollowing: true,
            },
        });
        expect(res).toMatchSnapshot();
    }));
    it('UNFOLLOW', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield mutate({
            mutation: mutation_1.UNFOLLOW,
            variables: {
                id: TEST_USER.id,
                unFollowId: TEST_ID,
            },
        });
        expect(res).toMatchSnapshot();
    }));
    it('SEND_MESSAGE', () => __awaiter(this, void 0, void 0, function* () {
        const receiverId = 'cory.mcaboy@gmail.com';
        const res = yield mutate({
            mutation: mutation_1.SEND_MESSAGE,
            variables: Object.assign({ id: TEST_USER.id, matchId: DATE_ID }, TEST_MESSAGE, { receiverId }),
        });
        expect(res.data.newMessage).toMatchSnapshot(Object.assign({}, TEST_MESSAGE, { createdAt: expect.any(String) }));
    }));
    it('SET_AGE_PREFERENCE', () => __awaiter(this, void 0, void 0, function* () {
        const NEW_MIN_AGE_PREF = 24;
        const NEW_MAX_AGE_PREF = 28;
        const res = yield mutate({
            mutation: mutation_1.SET_AGE_PREFERENCE,
            variables: {
                id: TEST_USER.id,
                minAgePreference: NEW_MIN_AGE_PREF,
                maxAgePreference: NEW_MAX_AGE_PREF,
            },
        });
        expect(res).toMatchSnapshot();
        expect(res.data.editUser.minAgePreference).toEqual(NEW_MIN_AGE_PREF);
        expect(res.data.editUser.maxAgePreference).toEqual(NEW_MAX_AGE_PREF);
    }));
    it('SET_DISTANCE', () => __awaiter(this, void 0, void 0, function* () {
        const DISTANCE = 45;
        const res = yield mutate({
            mutation: mutation_1.SET_DISTANCE,
            variables: {
                id: TEST_USER.id,
                distance: DISTANCE,
            },
        });
        expect(res).toMatchSnapshot();
        expect(res.data.editUser.distance).toEqual(DISTANCE);
    }));
    it('SET_NOTIFICATIONS', () => __awaiter(this, void 0, void 0, function* () {
        const NOTIFICATIONS = true;
        const res = yield mutate({
            mutation: mutation_1.SET_NOTIFICATIONS,
            variables: {
                id: TEST_USER.id,
                sendNotifications: NOTIFICATIONS,
            },
        });
        expect(res).toMatchSnapshot();
        expect(res.data.editUser.sendNotifications).toEqual(NOTIFICATIONS);
    }));
    it('SET_FOLLOWER_DISPLAY', () => __awaiter(this, void 0, void 0, function* () {
        const FOLLOWER_DISPLAY_BOTH = 'Both';
        const res = yield mutate({
            mutation: mutation_1.SET_FOLLOWER_DISPLAY,
            variables: {
                id: TEST_USER.id,
                followerDisplay: FOLLOWER_DISPLAY_BOTH,
            },
        });
        expect(res).toMatchSnapshot();
        expect(res.data.editUser.followerDisplay).toEqual(FOLLOWER_DISPLAY_BOTH);
    }));
    it('SET_NAME', () => __awaiter(this, void 0, void 0, function* () {
        const NEW_NAME = 'Michael Smith';
        const res = yield mutate({
            mutation: mutation_1.SET_NAME,
            variables: {
                id: TEST_USER.id,
                name: NEW_NAME,
            },
        });
        expect(res).toMatchSnapshot();
        expect(res.data.editUser.name).toEqual(NEW_NAME);
    }));
    it('SET_AGE', () => __awaiter(this, void 0, void 0, function* () {
        const NEW_AGE = 33;
        const res = yield mutate({
            mutation: mutation_1.SET_AGE,
            variables: {
                id: TEST_USER.id,
                age: NEW_AGE,
            },
        });
        expect(res).toMatchSnapshot();
        expect(res.data.editUser.age).toEqual(NEW_AGE);
    }));
    it('SET_WORK', () => __awaiter(this, void 0, void 0, function* () {
        const NEW_WORK = 'Poppa Johns';
        const res = yield mutate({
            mutation: mutation_1.SET_WORK,
            variables: {
                id: TEST_USER.id,
                work: NEW_WORK,
            },
        });
        expect(res).toMatchSnapshot();
        expect(res.data.editUser.work).toEqual(NEW_WORK);
    }));
    it('SET_SCHOOL', () => __awaiter(this, void 0, void 0, function* () {
        const NEW_SCHOOL = 'Shawnee High School';
        const res = yield mutate({
            mutation: mutation_1.SET_SCHOOL,
            variables: {
                id: TEST_USER.id,
                school: NEW_SCHOOL,
            },
        });
        expect(res).toMatchSnapshot();
        expect(res.data.editUser.school).toEqual(NEW_SCHOOL);
    }));
    it('SET_DESCRIPTION', () => __awaiter(this, void 0, void 0, function* () {
        const NEW_DESCRIPTION = 'Looking for something special';
        const res = yield mutate({
            mutation: mutation_1.SET_DESCRIPTION,
            variables: {
                id: TEST_USER.id,
                description: NEW_DESCRIPTION,
            },
        });
        expect(res).toMatchSnapshot();
        expect(res.data.editUser.description).toEqual(NEW_DESCRIPTION);
    }));
    it('SET_PICS', () => __awaiter(this, void 0, void 0, function* () {
        const NEW_PICS = [
            'https://firebasestorage.googleapis.com/v0/b/manhattanmatch-9f9fe.appspot.com/o/0a7a7fdb-39d9-484d-9b24-80fa0ef66240?alt=media&token=a79482d1-44f5-46be-87a2-56bce9340b89',
        ];
        const res = yield mutate({
            mutation: mutation_1.SET_PICS,
            variables: {
                id: TEST_USER.id,
                pics: NEW_PICS,
            },
        });
        expect(res).toMatchSnapshot();
        expect(res.data.editUser.pics).toEqual(NEW_PICS);
    }));
    it('SET_EMAIL', () => __awaiter(this, void 0, void 0, function* () {
        const NEW_EMAIL = 'test2@test.com';
        const res = yield mutate({
            mutation: mutation_1.SET_EMAIL,
            variables: {
                id: TEST_USER.id,
                email: NEW_EMAIL,
            },
        });
        expect(res.data.editUser.email).toEqual(NEW_EMAIL);
        expect(res).toMatchSnapshot();
        const reset = yield mutate({
            mutation: mutation_1.SET_EMAIL,
            variables: {
                id: TEST_USER.id,
                email: TEST_USER.email,
            },
        });
        expect(reset.data.editUser.email).toEqual(TEST_USER.email);
    }));
    it('REMOVE_USER', () => __awaiter(this, void 0, void 0, function* () {
        const res = yield mutate({
            mutation: mutation_1.REMOVE_USER,
            variables: {
                id: TEST_USER.id,
            },
        });
        expect(res).toMatchSnapshot();
        console.log('res: ', res);
        expect(res.data.removeUser.id).toEqual(TEST_USER.id);
    }));
});
//# sourceMappingURL=resolvers.mutations.js.map