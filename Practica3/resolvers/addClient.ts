import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/cliente.ts";

const addCliente = async (req: Request, res: Response) => {
  try {
    const { name, dni, dinero, gestor, hipotecas, historial } = req.body;
    if (!name || !dni ) {
      res.status(400).send("Se necesita nombre y dni");
      return;
    }

    const alreadyExists = await ClienteModel.findOne({dni }).exec();
    if (alreadyExists) {
      res.status(400).send("Cliente already exists");
      return;
    }

    const newCliente = new ClienteModel({ name, dni, dinero, gestor, hipotecas, historial });
    await newCliente.save();

    res.status(200).send({
        nombre: newCliente.name,
        dni: newCliente.dni,
        dinero: newCliente.dinero,
        gestor: newCliente.gestor,
        hipotecas: newCliente.hipotecas,
        historial: newCliente.historial,
        id: newCliente._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addCliente;
