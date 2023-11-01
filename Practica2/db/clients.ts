import mongoose from "npm:mongoose@7.6.3";
import { Cliente } from "../types.ts";

const Schema = mongoose.Schema;

const clienteSchema = new Schema(
  {
    name: { type: String, required: true },
    cif: { type: Number, required: true}, 
  },
  { timestamps: true }
);

export type ClienteModelType = mongoose.Document & Omit<Cliente, "id">;

export default mongoose.model<ClienteModelType>("Cliente", clienteSchema);