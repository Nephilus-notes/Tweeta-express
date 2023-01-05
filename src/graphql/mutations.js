const { User, Post } = require('../models')
// const { QuestionInputType, AnswerInputType } = require('./types')
const { GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql')
const { createJWTToken } = require('../util/auth')

const register = {
    type: GraphQLString,
    description: "Register new user",
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type:GraphQLString }
     },
     async resolve(parent, args) {

        const { username, email, password } = args

        const checkUser = await User.findOne({email})

        if (checkUser) {
            // return "User with that email already exists."

            throw new Error("User with that email already exists.")
        }

        const newUser = new User({
            username: username,
            email: email,
            password: password
        }) 

        await newUser.save()

        /* TODO: Generate web token */
        return createJWTToken(newUser)

     }
}

const login = {
    type: GraphQLString,
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(parent, args) {
        // console.log(args)
        const { email, password } = args
        const user = await User.findOne({email})

        if (!user || password !== user.password) {
            throw new Error("Invalid credentials or user doesn't exist.")
        }

        /* TODO: Generate web tokens */
        
        return createJWTToken(user)
    }
}

const createPost = {
    type: GraphQLString,
    args: {
        title: { type: GraphQLString },
        body: { type: GraphQLString },
        userId: { type: GraphQLString }
    },
    async resolve(parent, args) {
        /* */
        const slugify = args.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/[]/g, '-')

        let fullSlug = ''

        while (true) {
            let slugId = Math.floor(Math.random()*1000000)

            fullSlug = `${slugify}-${slugId}`

            const existingPost = await Post.findOne({ slug:fullSlug })
            if (!existingPost){
                break
            }
        }

        const post = new Post({
            slug: fullSlug,
            title: args.title,
            body: args.body,
            userId: args.userId
        })

        await post.save()

        return post.slug
    }
}

module.exports = {
    register,
    login,
    createPost,
}