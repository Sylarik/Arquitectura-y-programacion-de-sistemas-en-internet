import { Request, Response } from "npm:express@4.18.2";
import ProductoModel from "../db/products.ts";

const addProducto = async (req: Request, res: Response) => {
  try {
    const { name, price, description, stock} = req.body;
    if (!name || !price) {
      res.status(400).send("Name and price are required");
      return;
    }

    const alreadyExists = await ProductoModel.findOne({ name }).exec();
    if (alreadyExists) {
      res.status(400).send("El producto ya existes");
      return;
    }

    if(stock <0){
      res.status(400).send("No se puede poner un stock negativo");
      return;
    }
    if(price <0){
      res.status(400).send("El precio no puede ser negativo");
      return;
    }

    const newProducto = new ProductoModel({ name, price, description, stock});
    await newProducto.save();

    res.status(200).send({
      name: newProducto.name,
      stock: newProducto.stock,
      description: newProducto.description,
      price: newProducto.price,
      id: newProducto._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addProducto;
