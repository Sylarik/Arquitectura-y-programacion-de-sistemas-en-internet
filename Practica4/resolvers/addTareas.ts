//12. /task- > Deberá devolver todas las tareas

import { Request, Response } from "npm:express@4.18.2";
import TareaModel from "../db/tarea.ts";

const addTarea = async (req: Request, res: Response) => {
  try {
    const { name, estado, trabajador, empresa} = req.body;

    const newTarea = new TareaModel({ name, estado, trabajador,empresa,   });
    await newTarea.save();

    res.status(200).send({
      name: newTarea.name,
      estado: newTarea.estado,
      trabajador: newTarea.trabajador,
      empresa: newTarea.empresa,
      
      id: newTarea._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addTarea;