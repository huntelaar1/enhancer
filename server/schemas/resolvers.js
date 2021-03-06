
// is it mongoose or apollo- server - express ?
const { AuthenticationError } = require('mongoose');

const { AuthenticationError } = require('apollo-server-express');

const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {

    Query: { 
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: content.user.id }).select('-__v -password');

                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            // First we create the user
            const user = await User.create({ username, email, password });
            // To reduce friction for the user, we immediately sign a JSON Web Token and log the user in after they are created
            const token = signToken(user);
            // Return an `Auth` object that consists of the signed token and user's information
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            // Look up the user by the provided email address. Since the `email` field is unique, we know that only one person will exist with that email
            const user = await User.findOne({ email });

            // If there is no user with that email address, return an Authentication error stating so
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // If there is a user found, execute the `isCorrectPassword` instance method and check if the correct password was provided
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            // If email and password are correct, sign user into the application with a JWT
            const token = signToken(user);

            // Return an `Auth` object that consists of the signed token and user's information
            return { token, user };
        },
        saveArt: async (parent, { artData }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedArts: artData } },
                    { new: true }
                );
                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in !');
        },
        removeArt: async (parent, { artId }, context) => {
            if (contex.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedArts: { artId } } },
                    { new: true }
                );

                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in !');
        },
    },
};

module.exports = resolvers;
=======
    Query: {
      me: async (parent, args, context) => {
        if (context.user) {
          const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
  
          return userData;
        }
  
        throw new AuthenticationError('Not logged in');
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
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const token = signToken(user);
        return { token, user };
      },
      saveArt: async (parent, { artData }, context) => {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $push: { savedArt: artData } },
            { new: true }
          );
  
          return updatedUser;
        }
  
        throw new AuthenticationError('You need to be logged in!');
      },
      removeArt: async (parent, { bookId }, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedArt: { objectId } } },
            { new: true }
          );
  
          return updatedUser;
        }
  
        throw new AuthenticationError('You need to be logged in!');
      },
    },
  };

module.exports = resolvers;

