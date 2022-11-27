const {signToken} = require('../utils/auth');
const {User} = require('../models');
const {AuthenticationError} = require('apollo-server-express');

const resolvers = {
  Query: {
    // utilizing our context to get the current user
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    // taking in the values as they are passed from the front end "args" and creating a user based on that data, signing the token with that users information
    addUser: async (parent, args) => {
      const newUser = await User.create(args);
      const token = signToken(user);

      return { token, newUser };
    },
    // finding a user based on the email address,  once located it will take the password that was submitted and run it through our user model which will use bcrypt to compare the entered password with the hashed password that is saved in the database
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
    // using context to get the current user that is logged in and taking the bookData that was selected on the front end and saving that to the users savedBooks
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updated = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );

        return updated;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    // using context to get the current user that is logged in and removing a book based on the selected book by it "id". Using "pull" to remove it from that users document in mongodb
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updated = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updated;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
