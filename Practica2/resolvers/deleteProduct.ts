import { Request, Response } from "npm:express@4.18.2";
import ProductoModel from "../db/products.ts";

const deleteProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const producto = await ProductoModel.findOneAndDelete({ _id: id }).exec();
    if (!producto) {
      res.status(404).send("Producto no encontrado");
      return;
    }
    res.status(200).send("Producto eliminado");
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deleteProducto;
