const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
  _id: ID
  username: String
  email: String
  password: String
  savedBooks [Books]
}

type Book {
  _id: ID
  authors: String
  description: String
  bookId: String
  image: String
  link: String
  title: String
}

type Query {
  users: [User]
  user(userId: ID!): User
  me: User
}

type Mutation {
  addProfile(name: String!, email: String!, password: String!): Auth
  login(email: String!, password: String!): Auth
}`;
