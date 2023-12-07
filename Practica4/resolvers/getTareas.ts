//9 /task- > Deberá devolver todas las tareas

import { Request, Response } from "npm:express@4.18.2";
import TareaModel from "../db/tarea.ts";

const getTareas = async (req: Request, res: Response) => {
  try {
    
    const tareas = await TareaModel.find().populate(["trabajador", "empresa"]).exec();

    res.status(200).send(
      tareas.map((tarea) => ({
        nombre: tarea.name,
        estado: tarea.estado,
        trabajador: tarea.trabajador,
        empresa: tarea.empresa,
        id: tarea._id.toString(),
      }))
    );
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getTareas;