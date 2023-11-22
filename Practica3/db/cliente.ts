import mongoose from "npm:mongoose@8.0.1";
import { Cliente } from "../types.ts";

const Schema = mongoose.Schema;

const clienteSchema = new Schema(
  {
    name: { type: String, required: true },
    dni: { type: String, required: true}, 
    dinero: { type: Number, required: false, default:0},
    gestor: {type: String, required: false, default: ""}, //id gestor
    hipotecas: {type: [String], required: false}, //hacer excepcion de que no puede haber una de mas de 1M
    historial: {type: [String], required: false},
  },
  { timestamps: true }
);

export type ClienteModelType = mongoose.Document & Omit<Cliente, "id">;

export default mongoose.model<ClienteModelType>("Cliente", clienteSchema);