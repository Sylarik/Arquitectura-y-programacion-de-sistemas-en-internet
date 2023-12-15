import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";

import  PetModel from "./db/pets.ts";
import mongoose from "npm:mongoose@8.0.1";

import { Character } from "./types.ts";
import { Episode } from "./types.ts";

import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
const env = await load();

const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL") ; //1-> busca en env /2-> archivo del sistema


if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);

// The GraphQL schema
const typeDefs = `#graphql
  type Character {
    id: ID!
    name: String!
    episode: [Episode!]!
  }

  type Episode {
    id: ID!
    name: String!
    characters: [Character!]!
  }

  type  Query {
    character(id: ID!): Character #devuelve un personaje segú su id
    charactersByIds(ids: [ID!]!): [Character] #devuelve un array de personajes según sus ids
  }
  
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    character: async(_: unknown, args: { id: string }):Promise<Character> => {
      try{
        const personaje = await fetch(`https://rickandmortyapi.com/api/character/${args.id}`);
        if(!personaje){
          throw new Error("Error al obtener el personaje");
        }
        const personajeJson = await personaje.json(); //

        //se hace promise all xq tengo async
        //consulta de episodios

      await Promise.all(  
        personajeJson.episode.map( async (epi: string) => {
          const episodio = await fetch(epi); //hacer consulta en internet
          const episodiosJson = await episodio.json(); //obtengo los datos
          return {
            id: episodiosJson.id,
            name: episodiosJson.name,
            characters: episodiosJson.characters,
          };
          }
          //
        
        )
      );

        return {
          id: personajeJson.id,
          name: personajeJson.name,
          episode: personajeJson.episode,
        };

      }catch(error){
        console.log(error);
        return error;
      }
      
    },

    /*
    charactersByIds: async(_: unknown, args: { ids: string[] }):Promise<Character[]> => {
      
    },
    */

  },

};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);