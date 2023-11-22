import mongoose from "npm:mongoose@7.6.3";
import { Hipoteca } from "../types.ts";

const Schema = mongoose.Schema;

const hipotecaSchema = new Schema(
  {
    cuota: { type: Number, required: false, default:20},
    importe: { type: Number, required: true},
    cliente: { type: String, required: true},
    gestor: { type: String, required: true},
  },
  { timestamps: true }
);

export type HipotecaModelType = mongoose.Document & Omit<Hipoteca, "id">;

export default mongoose.model<HipotecaModelType>("Hipoteca", hipotecaSchema);