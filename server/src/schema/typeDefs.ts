const typeDefs = `
    type User {
        id: String!
        active: Boolean
        name: String
        email: String
        age: Int
        description: String
        school: String
        work: String
        sendNotifications: Boolean
        gender: String
        distance: Int
        token: String
        latitude: Float
        longitude: Float
        minAgePreference: Int
        maxAgePreference: Int
        match: Boolean
        distanceApart: Float
        order: Float
        registerDateTime: String
        pics: [String]
        profilePic: String
        hasDateOpen: Boolean
        isFollowing: Boolean
        following: Following
        bids: DateBidList
        dateRequests: DateList
        queue: Queue
        matchedDates: [Match]
    }

    type DateList {
        list: [DateItem]
        cursor: Float
    }

    type DateBidList {
        list: [DateBid]
        cursor: Float
    }

    type Following {
        list: [User]
        cursor: Float
    }

    type Queue {
        list: [User]
        cursor: Float
    }

    type DateItem {
        id: String
        creator: User
        winner: User
        creationTime: String
        datetimeOfDate: String
        description: String
        bids: DateBidList
        num_bids: Int
        open: Boolean
        creationTimeEpoch: Float
        order: Float
    }

    type DateBid {
        id: String
        datetimeOfBid: String
        bidDescription: String
        bidPlace: String
        user: User
    }

    type MessageItem {
        name: String
        avatar: String
        _id: String
        createdAt: String
        text: String
        order: Float
        uid: String
    }
    
    type Message {
        id: String 
        cursor: String
        list: [MessageItem]!
    }

    type Match {
        matchId: String
        user: User
        messages: Message
        lastMessage: MessageItem
    }

    type Query {
        user(id: String!): User
        messages(id: String!): Message
        date(id: String!): DateItem
        moreMessages(id: String!, cursor: String!): Message
        moreQueue(id: String!, cursor: Float!): Queue
        moreDates(id: String!, cursor: Float!): DateList
        moreDateBids(id:String!, cursor: Float!): DateBidList
        moreFollowing(id: String!, cursor: Float!): Following
    }

    type Subscription {
        newMessageSub(matchId: String, id: String): MessageItem
    }

    type Mutation {
        editUser (
            id: String!
            name: String
            active: Boolean
            email: String
            gender: String
            age: Int
            description: String
            school: String
            work: String
            sendNotifications: Boolean
            distance: Int
            token: String
            latitude: Float
            longitude: Float
            registerDateTime: String
            minAgePreference: Int
            maxAgePreference: Int
            pics: [String]
        ): User
        newUser (
            id: String!
            name: String
            active: Boolean
            email: String
            gender: String
            age: Int
            description: String
            school: String
            work: String
            sendNotifications: Boolean
            distance: Int
            token: String
            latitude: Float
            longitude: Float
            registerDateTime: String
            minAgePreference: Int
            maxAgePreference: Int
            pics: [String]
        ): User
        newMessage (
            matchId: String! 
            name: String 
            text: String
            createdAt: String
            avatar: String
            order: Float
            uid: String
            _id: String
        ): MessageItem
        follow (id: String!, followId: String!): User
        bid(id: String!, dateId: String!, bidPlace: String, bidDescription: String): DateBid
        createDate(id: String!, datetimeOfDate: String, description: String): DateItem
        chooseWinner(id: String!, winnerId: String!, dateId: String!): DateItem
    }

    schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
    }
`;

export default typeDefs;