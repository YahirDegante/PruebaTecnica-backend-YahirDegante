const { gql } = require('apollo-server-express');

//Definición de tipos GraphQL para usuarios y libros.
const typeDefs = gql`
  type User {
    _id: ID!
    userId: Int!  
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    books: [Book]!
  }

  type Book {
    _id: ID!
    bookId: Int!  
    title: String!
    author: String!
    userId: Int!  
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
    user(userId: Int!): User             
    books: [Book!]!
    book(bookId: Int!): Book
    userBooks(userId: Int!): [Book!]!
  }

  type Mutation {
    createUser(input: UserInput!): User!
    updateUser(userId: Int!, input: UpdateUserInput!): User!   
    deleteUser(userId: Int!): Boolean!                         
    createBook(userId: Int!, input: BookInput!): Book!          
    updateBook(bookId: Int!, input: UpdateBookInput!): Book!    
    deleteBook(bookId: Int!): Boolean!                          
  }
`;

module.exports = typeDefs;