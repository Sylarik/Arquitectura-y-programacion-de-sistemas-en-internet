import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/clients.ts";

const getCliente = async (req: Request, res: Response) => {
  try {
    const clientes = await ClienteModel.find().exec();
    
    res.status(200).send(clientes);
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getCliente;
