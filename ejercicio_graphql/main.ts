import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import { Pet } from "./types.ts";
import  PetModel from "./db/pets.ts";

// Data
/*
let pets: Pet[] = [
  { id: "1", name: "Pippin", breed: "Setter" },
  { id: "2", name: "Arwen", breed: "Labrador" },
  { id: "3", name: "Frodo", breed: "Pointer" },
  { id: "4", name: "Sam", breed: "Spaniel" },
  { id: "5", name: "Merry", breed: "Poodle" },
];
*/

// The GraphQL schema
const typeDefs = `#graphql
  type Pet {
    id: ID!
    name: String!
    breed: String!
  }
  type Query {
    hello: String!
    pets: [Pet!]!
    pet(id: ID!): Pet!
  }
  type Mutation {
    addPet(id: ID!, name: String!, breed: String!): Pet!
    deletePet(id: ID!): Pet!
    updatePet(id: ID!, name: String!, breed: String!): Pet!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    pets: async ():Promise<Pet[]> => {
      const petsModel = await PetModel.find().exec();
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
      }
      
    },
      

    addPet: async(_: unknown, args: { id: string; name: string; breed: string }) => {
      const pet = {
        id: args.id,
        name: args.name,
        breed: args.breed,
      };

      const newPet = new PetModel({ id: args.id, name: args.id, breed: args.breed});
      await newPet.save();
      return pet;
    },

    deletePet: async (_: unknown, args: { id: string }) => {
      const pet = await PetModel.findOne({ _id: args.id }).exec();
      
      if (!pet) {
        throw new GraphQLError(`No pet found with id ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }

      await PetModel.findOneAndDelete({ _id: args.id }).exec();
    },

    updatePet: async(_: unknown, args: { id: string; name: string}) => {
      const pet = await PetModel.find({ _id: args.id }).exec();
      if (!pet) {
        throw new GraphQLError(`No pet found with id ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const newName = args.name;

      const updatedSaldoEmisor = await PetModel.findOneAndUpdate(
        { _id : args.id },
        { name: newName},
        
        { new: true }
      ).exec();

      return pet;
    },
  
  };

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);