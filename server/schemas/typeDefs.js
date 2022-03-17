const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    bookCount: Int
    gallery: [Art]
  }

  type Art {
    artist: String
    objectId: ID!
    isHighlight: Boolean
    title: String!
    image: String!
    objectDate: String
    culture: String
    objectName: String
    city: String
    country: String
  }

  type Auth {
    token: ID!
    user: User
  }



  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;