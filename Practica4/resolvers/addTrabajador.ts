//10. /worker - > Deberá crear un trabajador

import { Request, Response } from "npm:express@4.18.2";
import TrabajadorModel from "../db/trabajador.ts";

const addTrabajador = async (req: Request, res: Response) => {
  try {
    const { name, empresa, tareas} = req.body;

    const newTrabajador = new TrabajadorModel({ name, empresa, tareas });
    await newTrabajador.save();

    res.status(200).send({
      name: newTrabajador.name,
      empresa: newTrabajador.empresa,
      tareas: newTrabajador.tareas,
      id: newTrabajador._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addTrabajador;