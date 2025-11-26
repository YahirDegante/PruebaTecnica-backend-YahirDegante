const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    books: [Book]!
  }

  type Book {
    _id: ID!
    title: String!
    author: String!
    userId: ID!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  input UserInput {
    name: String!
    email: String!
  }
  
  input BookInput {
    title: String!
    author: String!
  }

  input UpdateUserInput {
    name: String
    email: String
  }
  
  input UpdateBookInput {
    title: String
    author: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    books: [Book!]!
    book(id: ID!): Book
    userBooks(userId: ID!): [Book!]!
  }

  type Mutation {
    createUser(input: UserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    createBook(userId: ID!, input: BookInput!): Book!
    updateBook(id: ID!, input: UpdateBookInput!): Book!
    deleteBook(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;