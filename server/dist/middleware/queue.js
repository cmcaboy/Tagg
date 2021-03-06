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
const QUEUE_PAGE_LENGTH = 5;
exports.getQueue = ({ id, followerDisplay, session, }) => __awaiter(this, void 0, void 0, function* () {
    let followQuery;
    switch (followerDisplay) {
        case 'Following Only':
            followQuery = 'AND isFollowing';
            break;
        case 'Non-Following Only':
            followQuery = 'AND NOT isFollowing';
            break;
        default:
            followQuery = '';
    }
    let viewObjectionable;
    try {
        const viewObjectionableRaw = yield session.run(`MATCH(a:User{id:'${id}}) return a.viewObjectionable`);
        const viewObjectionableResult = viewObjectionableRaw.records[0].fields[0];
        if (viewObjectionableResult) {
            viewObjectionable = 'AND NOT viewObjectionable';
        }
        else {
            viewObjectionable = '';
        }
    }
    catch (e) {
        console.log('Not able to obtain viewObjectionable preference. Defaulting to view non-objectionable content');
        viewObjectionable = '';
    }
    const query = `MATCH(a:User{id:'${id}'}),(b:User)
    WITH a,b, size((b)<-[:FOLLOWING]-()) as num_likes,
    distance(point(a),point(b))*0.000621371 as distanceApart,
    ((distance(point(a),point(b))*0.000621371)*(1/toFloat((SIZE((b)<-[:FOLLOWING]-())+1)))) as order,
    exists((a)-[:FOLLOWING]->(b)) as isFollowing,
    exists((b)-[:CREATE]->(:Date{open:TRUE})) as hasDateOpen,
    exists((b)-[:BLOCK]->(a)) as blockedUser,
    exists((a)-[:BLOCK]->(b)) as blocks,
    exists((a)-[]->(b { objectionable: true} )) as viewObjectionable
    where 
    NOT blockedUser AND
    NOT blocks AND
    NOT b.id=a.id AND
    NOT b.gender=a.gender AND
    distanceApart < a.distance
    ${followQuery}
    ${viewObjectionable}
    RETURN b, distanceApart, num_likes, order, isFollowing, hasDateOpen
    ORDER BY order
    LIMIT ${QUEUE_PAGE_LENGTH}`;
    return session
        .run(query)
        .then((result) => result.records)
        .then((records) => {
        const list = records.map((record) => (Object.assign({}, record._fields[0].properties, { distanceApart: record._fields[1], order: record._fields[3], profilePic: record._fields[0].properties.pics ? record._fields[0].properties.pics[0] : null, isFollowing: record._fields[4], hasDateOpen: record._fields[5] })));
        if (list.length === 0) {
            return {
                list: [],
                cursor: null,
                id: `${id}q`,
            };
        }
        const newCursor = list.length >= QUEUE_PAGE_LENGTH ? list[list.length - 1].order : null;
        return {
            list,
            cursor: newCursor,
            id: `${id}q`,
        };
    })
        .catch((e) => {
        console.log('queue error: ', e);
        return {
            list: [],
            cursor: null,
            id: `${id}q`,
        };
    });
});
//# sourceMappingURL=queue.js.map