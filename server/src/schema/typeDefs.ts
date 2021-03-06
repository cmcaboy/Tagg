const typeDefs = `
    type User {
        id: String
        active: Boolean
        name: String
        email: String
        age: Int
        description: String
        school: String
        work: String
        sendNotifications: Boolean
        viewObjectionable: Boolean
        gender: String
        distance: Int
        token: String
        latitude: Float
        longitude: Float
        minAgePreference: Int
        maxAgePreference: Int
        followerDisplay: String
        match: Boolean
        distanceApart: Float
        order: Float
        registerDateTime: Int
        pics: [String]
        profilePic: String
        hasDateOpen: Boolean
        isFollowing: Boolean
        following: Following
        bids: DateBidList
        dateRequests: DateList
        queue: Queue
        matchedDates: MatchList
        objectionable: Boolean
    }

    type DateList {
        id: String
        list: [DateItem]
        cursor: Float
    }

    type DateBidList {
        id: String
        list: [DateBid]
        cursor: Float
    }

    type Following {
        id: String
        list: [User]
        cursor: Float
    }

    type Queue {
        id: String
        list: [User]
        cursor: Float
    }

    type MatchList {
        id: String
        list: [Match]
        cursor: Float
    }

    type DateItem {
        id: String
        creator: User
        winner: User
        creationTime: Int
        datetimeOfDate: Int
        description: String
        bids: DateBidList
        num_bids: Int
        open: Boolean
        creationTimeEpoch: Float
        order: Float
    }

    type DateBid {
        id: String
        datetimeOfBid: Int
        bidDescription: String
        bidPlace: String
        dateUser: User
        bidUser: User
        date: DateItem
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
        cursor: Float
        list: [MessageItem]!
    }

    type Match {
        id: String
        matchId: String
        winnerId: String
        user: User
        description: String
        datetimeOfDate: Int
        messages: Message
        lastMessage: MessageItem
    }

    type Query {
        user(id: String, hostId: String): User
        messages(id: String!): Message
        date(id: String!): DateItem
        dates(id: String!): DateList
        otherBids(id: String): DateBidList
        moreMessages(id: String!, cursor: String!): Message
        moreQueue(followerDisplay: String, cursor: Float!): Queue
        moreDates(id: String!, cursor: Float!): DateList
        moreDateBids(id:String!, cursor: Float!): DateBidList
        moreFollowing(id: String!, cursor: Float!): Following
        likes(id: String, cursor: Float): Queue
        dislikes(id: String, cursor: Float): Queue
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
            registerDateTime: Int
            minAgePreference: Int
            maxAgePreference: Int
            followerDisplay: String
            objectionable: Boolean
            viewObjectionable: Boolean
            pics: [String]
        ): User
        editUserQueue (
            id: String!
            sendNotifications: Boolean
            distance: Int
            minAgePreference: Int
            maxAgePreference: Int
            followPreference: Int
        ): Queue
        newUser (
            id: String!
            name: String!
            active: Boolean
            email: String!
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
            registerDateTime: Int
            minAgePreference: Int
            maxAgePreference: Int
            followerDisplay: String
            objectionable: Boolean
            viewObjectionable: Boolean
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
            receiverId: String
        ): MessageItem
        follow (id: String!, followId: String!, isFollowing: Boolean): User
        unFollow (id: String!, unFollowId: String!): User
        bid(id: String!, dateId: String!, bidPlace: String, bidDescription: String): DateBid
        createDate(id: String!, datetimeOfDate: Int, description: String): DateItem
        chooseWinner(id: String!, winnerId: String!, dateId: String!): Match
        flag(id: String!, flaggedId: String!, block: Boolean): User
        block(id: String!, blockedId: String!): User
        removeUser(id: String): User
        login(email: String!, password: String!): String
        signup(
            email: String!
            password: String!
            id: String!
            name: String!
            active: Boolean
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
            registerDateTime: Int
            minAgePreference: Int
            maxAgePreference: Int
            followerDisplay: String
            objectionable: Boolean
            viewObjectionable: Boolean
            pics: [String]
        ): String
    }
    schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
    }
`;

export default typeDefs;
