const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError('You are not logged in!');
            }

            const userData = await User.findById(context.user._id).select('-__v -password');
            return userData;
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { newBook }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You are not logged in!');
            }

            const updatedUser = await User.findByIdAndUpdate(
                context.user._id,
                { $push: { savedBooks: newBook } },
                { new: true }
            );
            return updatedUser;
        },
        removeBook: async (parent, { bookId }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You are not logged in!');
            }

            const updatedUser = await User.findByIdAndUpdate(
                context.user._id,
                { $pull: { savedBooks: { bookId } },
                { new: true }
            );
            return updatedUser;
        },
    },
};

module.exports = resolvers;