import  {
    GraphQLObjectType,
    GraphQLString, // GraphQL's string type
    GraphQLBoolean,
  } from 'graphql';
  
  const LikeUserType = new GraphQLObjectType({
    name: 'LikeUserType',
    fields: () => ({
        likedId: {type: GraphQLString},
        name: {type: GraphQLString},
        match: {type: GraphQLBoolean},
    })
  });


  
  export {LikeUserType};