import mongoose from "npm:mongoose@7.6.3";
import { Factura } from "../types.ts";

const Schema = mongoose.Schema;

const facturaSchema = new Schema(
  {
    client: { type: String, required: true },
    products: { type: [String], required: false, default: 0 },
    total: { type: Number, required: false },
    
  },
  { timestamps: true }
);

export type ProductoModelType = mongoose.Document & Omit<Factura, "id">;

export default mongoose.model<ProductoModelType>("Factura", facturaSchema);