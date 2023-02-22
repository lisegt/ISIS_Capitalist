const express = require('express');

const { ApolloServer, gql } = require('apollo-server-express');
// Construct a schema, using GraphQL schema language
const typeDefs = require("./schema")

// Provide resolver functions for your schema fields
const resolvers = require("./resolvers")

//inclure le monde complet défini dans world.js
let world = require("./world")

const fs = require("fs").promises;

//fonction pour que l'utilisateur récupère son monde et pas celui d'origine
// fonction qui tente de lire le monde associé au joueur
async function readUserWorld(user) {
    try {
        // on cherche à accéder au fichier du user
        const data = await fs.readFile("userworlds/"+ user + "-world.json");
        return JSON.parse(data);
    }
    catch (error) {
        //on retourne le monde par défaut, notamment lors de la première connexion
        return world
    }
}

const server = new ApolloServer({
    typeDefs, resolvers,
    context: async ({ req }) => ({
        //on appelle le monde du joueur connecté
        world: await readUserWorld(req.headers["x-user"]),
        //récupération de l'en-tête x-user ds requête http = récupérer nom du joueur dans contexte
        user: req.headers["x-user"]
    })
});

const app = express();
app.use(express.static('public'));
server.start().then( res => {
    server.applyMiddleware({app});
    app.listen({port: 4000}, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    ); })