import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import connection from './config/connection.js';

import typeDefs from './schema/typeDef.js';
import resolvers from './schema/resolvers.js';


const app = express()
const PORT = process.env.PORT || 3333;


const server = new ApolloServer({
    typeDefs,
    resolvers,
});

connection.once('open', async () => {
    await server.start();


    // Middleware
    // Allows json to be attached to the req.body in our routes
    app.use(
        '/graphql',
        express.json(),
        expressMiddleware(server),
    );


    app.listen(PORT, () => {
        console.log('Express server started on', PORT);
    });

});