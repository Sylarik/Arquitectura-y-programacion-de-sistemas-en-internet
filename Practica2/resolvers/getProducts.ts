import { Request, Response } from "npm:express@4.18.2";
import ProductoModel from "../db/products.ts";

const getProducto = async (req: Request, res: Response) => {
  try {
    const productos = await ProductoModel.find().exec();
    
    res.status(200).send(productos);
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getProducto;
