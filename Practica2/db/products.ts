import mongoose from "npm:mongoose@7.6.3";
import { Producto } from "../types.ts";

const Schema = mongoose.Schema;

const productoSchema = new Schema(
  {
    name: { type: String, required: true },
    stock: { type: Number, required: false, default: 0 },
    description: { type: String, required: false },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export type ProductoModelType = mongoose.Document & Omit<Producto, "id">;

export default mongoose.model<ProductoModelType>("Producto", productoSchema);