require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const connectDB = require('./config/database');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./resolvers/resolvers');

connectDB();

const startServer = async () => {
    const app = express();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: (error) => {
            console.error('GraphQL Error:', error);
            return {
                message: error.message,
                code: error.extensions?.code || 'INTERNAL_ERROR'
            };
        }
    });

    await server.start();
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
        console.log(`Servidor ejecutandose en http://localhost:${PORT}${server.graphqlPath}`);
    });
};

startServer().catch(console.error);