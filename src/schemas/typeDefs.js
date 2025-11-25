const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  input UserInput {
    name: String!
    email: String!
  }

  input UpdateUserInput {
    name: String
    email: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(input: UserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;