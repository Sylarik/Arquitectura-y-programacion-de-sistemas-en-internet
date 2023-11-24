import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import { Pet } from "./types.ts";
import  PetModel from "./db/pets.ts";
import mongoose from "npm:mongoose@8.0.1";

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
  type Pet {
    id: ID!
    name: String!
    breed: String!
  }
  type Query {
    pets: [Pet!]!
    pet(id: ID!): Pet!
  }
  type Mutation {
    filterPet(breed: String!): [Pet!]!
    addPet(name: String!, breed: String!): Pet!
    deletePet(id: ID!): Pet!
    updatePet(id: ID!, name: String, breed: String): Pet!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    pets: async ():Promise<Pet[]> => {
      const petsModel = await PetModel.find({}).exec();
      const pets:Pet[] = petsModel.map((pet) => {
        return {
          id: pet._id.toString(),
          name: pet.name,
          breed: pet.breed,
        };
      });
      return pets;
    },

    pet: async (_: unknown, args: { id: string }) : Promise<Pet> => {
      const petModel = await PetModel.findOne().exec();
      
      if (!petModel) {
        throw new GraphQLError(`No pet found with id ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return {
        id: petModel._id.toString(),
        name: petModel.name,
        breed: petModel.breed,
      };
    },

  },
  Mutation: {
    //filtrar por raza
    filterPet: async (_: unknown, args: { breed: string }): Promise<Pet[]> => {
      const petsModel = await PetModel.find({breed: args.breed}).exec();
      const pets = petsModel.map((pet) => {
        return {
          id: pet._id.toString(),
          name: pet.name,
          breed: pet.breed,
        };
      });
      return pets;
    },
      

    addPet: async(_: unknown, args: { name: string; breed: string }) => {

      const newPet = new PetModel({  name: args.name, breed: args.breed});
      await newPet.save();
      return {
        id: newPet._id.toString(),
        name: newPet.name,
        breed: newPet.breed,
      
      };
    },

    deletePet: async (_: unknown, args: { id: string }) => {
      const pet = await PetModel.findOne({ _id: args.id }).exec();
      
      if (!pet) {
        throw new GraphQLError(`No pet found with id ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }

      return await PetModel.findOneAndDelete({ _id: args.id }).exec();
    },

    updatePet: async(_: unknown, args: { id: string; name: string}) => {
      const pet = await PetModel.find({ _id: args.id }).exec();
      if (!pet) {
        throw new GraphQLError(`No pet found with id ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const newName = args.name;

      const updatedPet = await PetModel.findOneAndUpdate(
        { _id : args.id },
        { name: newName},
        
        { new: true }
      ).exec();

      return updatedPet;
    },
  
  },

};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);