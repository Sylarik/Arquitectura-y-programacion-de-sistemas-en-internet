import { Request, Response } from "npm:express@4.18.2";
import FacturaModel from "../db/invoices.ts";

const addFactura = async (req: Request, res: Response) => {
  try {
    const { client, products, total } = req.body;
    if (!client || !products || !total) {
      res.status(400).send("Se requieren todos los parametros");
      return;
    }

    const newFactura = new FacturaModel({ client, products, total });
    await newFactura.save();

    res.status(200).send({
      client: newFactura.client,
      products: newFactura.products,
      total: newFactura.total,
      id: newFactura._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addFactura;