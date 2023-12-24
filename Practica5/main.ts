import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import { Cliente } from "./types.ts";
import { Conductor } from "./types.ts";
import { Tarjeta } from "./types.ts";
import { Viaje } from "./types.ts";
import  ClienteModel from "./db/cliente.ts";
import  ConductorModel from "./db/conductor.ts";
import  ViajeModel from "./db/viaje.ts";


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

  type Cliente {
    name: String!     # ! significa que es obligatorio
    email: String!
    cards: [Tarjeta!]!
    travels: [Viaje!]!
  }

  type Tarjeta {
    number: String!
    cvv: Int!
    expiration: String!
    money: Int!
  }

  type Conductor {
    name: String!
    email: String!
    username: String!
    travels: [Viaje!]!
  }

  type Viaje {
    client: String!
    driver: String!
    money: Int!
    distance: Int!
    date: String!
    status: String!
  }

  type Query {
    getClientes: [Cliente!]!
    getConductores: [Conductor!]!
    getViajes: [Viaje!]!
  }
  type Mutation {
    addCliente(name: String!, email: String!): Cliente!
    addConductor(name: String!, email: String!, username: String!): Conductor!
    deleteCliente(id: ID!): Cliente!
    deleteConductor(id: ID!): Conductor!
    addTarjeta(id: String!, number: String!, cvv: Int!, expirity: String!, money: Int): Tarjeta! 
    deleteTarjeta(idc: ID!,idt: ID!): Tarjeta!
    addViaje(client: String!, driver: String!, money: Int!, distance: Int!, date: String!): Viaje!
    updateViaje(id: ID!): Viaje!

  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  //query solo va a ser para los gets
  Query: {
    getClientes: async ():Promise<Cliente[]> => {
      const clientesModel = await ClienteModel.find().exec();
      const clientes:Cliente[] = clientesModel.map((cliente) => {
        return {
          id: cliente._id.toString(),
          name: cliente.name,
          email: cliente.email,
          cards: cliente.cards,
          travels: cliente.travels,
        };
      });
      return clientes;
    },

    getConductores: async ():Promise<Conductor[]> => {
      const conductoresModel = await ConductorModel.find().exec();
      const conductores:Conductor[] = conductoresModel.map((conductor) => {
        return {
          id: conductor._id.toString(),
          name: conductor.name,
          email: conductor.email,
          username: conductor.username,
          travels: conductor.travels,
        };
      });
      return conductores;
    },

    getViajes: async ():Promise<Viaje[]> => {
      const viajesModel = await ViajeModel.find().exec();
      const viajes:Viaje[] = viajesModel.map((viaje) => {
        return {
          id: viaje._id.toString(),
          client: viaje.client,
          driver: viaje.driver,
          money: viaje.money,
          distance: viaje.distance,
          date: viaje.date,
          status: viaje.status,
        };
      });
      return viajes;
    },


  },

  //mutation para los posts, put, delete
  Mutation: {
    
    addCliente: async(_: unknown, args: { name: string; email: string }) => {
        const newCliente = new ClienteModel({  name: args.name, email: args.email});
        await newCliente.save();
        return {
          name: newCliente.name,
          email: newCliente.email,
          cards: newCliente.cards,
          travels: newCliente.travels,
        
        };
    },

    addConductor: async(_: unknown, args: { name: string; email: string; username: string }) => {
        const newConductor = new ConductorModel({  name: args.name, email: args.email, username: args.username});
        await newConductor.save();
        return {
          name: newConductor.name,
          email: newConductor.email,
          username: newConductor.username,
          travels: newConductor.travels,
        
        };
    },

    deleteCliente: async (_: unknown, args: { id: string }) => {
      const cliente = await ClienteModel.findOne({ _id: args.id }).exec();
      if (!cliente) {
        throw new GraphQLError(`No cliente found with id ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return await ClienteModel.findOneAndDelete({ _id: args.id }).exec();
    },

   
    deleteConductor: async (_: unknown, args: { id: string }) => {
      const conductor = await ConductorModel.findOne({ _id: args.id }).exec();
      if (!conductor) {
        throw new GraphQLError(`No conductor found with id ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return await ConductorModel.findOneAndDelete({ _id: args.id }).exec();
    },


    addTarjeta: async(_: unknown, args: {id: string, number: string, cvv:number, expirity: string, money: number}) => {
      //const {number, cvv, expirity, money} = args;

      const cliente = await ClienteModel.findOne({ _id: args.id }).exec();
      if (!cliente) {
        throw new GraphQLError(`No cliente found with id ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }

      /*
      //comprobar q no existen tarjetas con ese numero
      const tarjetas = cliente.cards;
      tarjetas.forEach((tarjeta: Tarjeta) => {
        if(tarjeta.number == args.number || tarjeta.number != null){
          throw new GraphQLError(`Ya existe una tarjeta con ese numero`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
      });
      */

      const newTarjeta = {number: args.number, cvv: args.cvv, expiration: args.expirity, money: args.money};
      cliente.cards.push(newTarjeta);
      await cliente.save();
      return newTarjeta;
    },

    
    deleteTarjeta: async (_: unknown, args: { idc: string, idt: string }) => {
      const cliente = await ClienteModel.findOne({ _id: args.idc }).exec();
      if (!cliente) {
        throw new GraphQLError(`No cliente found with id ${args.idc}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const tarjeta = cliente.cards.find((tarjeta: Tarjeta) => {
        if(tarjeta.number == args.idt){
          return true;
        }
      });

      if(!tarjeta){
        throw new GraphQLError(`No tarjeta found with id ${args.idt}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }

      await ClienteModel.findOneAndUpdate(
        { _id : args.idc },
        { $pull: { cards: tarjeta } },
        { new: true }
      ).exec();

      await cliente.save();
      return tarjeta;
    },

 
    addViaje: async(_: unknown, args: {client: string, driver: string, money: number, distance: number, date: string}) => {
      const newViaje = new ViajeModel({  client: args.client, driver: args.driver, money: args.money, distance: args.distance, date: args.date});

      const cliente = await ClienteModel.findOne({ _id: args.client }).exec();
      if (!cliente) {
        throw new GraphQLError(`No cliente found with id ${args.client}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      const conductor = await ConductorModel.findOne({ _id: args.driver }).exec();
      if (!conductor) {
        throw new GraphQLError(`No conductor found with id ${args.driver}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      
      await newViaje.save();
      return {
        client: newViaje.client,
        driver: newViaje.driver,
        money: newViaje.money,
        distance: newViaje.distance,
        date: newViaje.date,
        status: newViaje.status,
      
      };

    },
    
  
    updateViaje: async(_: unknown, args: {id: string}) => {
      const viaje = await ViajeModel.findOne({ _id: args.id }).exec();
      if (!viaje) {
        throw new GraphQLError(`No viaje found with id ${args.id}`, {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const updatedViaje = await ViajeModel.findOneAndUpdate(
        { _id : args.id },
        { status: "finalizado"},
        { new: true }
      ).exec();
      
      return updatedViaje;
    },
    
  },

};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
