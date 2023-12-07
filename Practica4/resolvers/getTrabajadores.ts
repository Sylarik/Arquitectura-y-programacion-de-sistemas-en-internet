//7. /worker - > Deberá devolver todos los trabajadores

import { Request, Response } from "npm:express@4.18.2";
import TrabajadorModel from "../db/trabajador.ts";

const getTrabajadores = async (req: Request, res: Response) => {
  try {
    
    const trabajadores = await TrabajadorModel.find().populate(["tareas", "empresa"]).exec();

    res.status(200).send(
      trabajadores.map((trabajador) => ({
        nombre: trabajador.name,
        tareas: trabajador.tareas,
        empresa: trabajador.empresa,
        id: trabajador._id.toString(),
      }))
    );
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getTrabajadores;