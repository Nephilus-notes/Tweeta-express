const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} = require("graphql");
const { description } = require("./schema");
const { Post, User } = require("../models");

const UserType = new GraphQLObjectType({
  name: "UserType",
  description: "User type",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({
          userId: parent.id,
        });
      },
    },
  }),
});

const PostType = new GraphQLObjectType ({
    name: "PostType",
    description: "Post type",
    fields: () => ({
        id: { type: GraphQLID },
        slug: { type: GraphQLString },
        title: { type: GraphQLString },
        body: { type: GraphQLString },
        userId: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId)
            }
        },
    })
})

module.exports = {
  UserType,
  PostType,
};
