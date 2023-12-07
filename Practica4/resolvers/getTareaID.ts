//3. /task/:id

import { Request, Response } from "npm:express@4.18.2";
import TareaIdModel from "../db/tarea.ts";

const getTareaId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;  
    const tarea = await TareaIdModel.findOne({_id: id}).populate(["trabajador", "empresa"]).exec();
    if (!tarea) {
        res.status(404).send("Tarea no encontrado");
        return;
    }

    res.status(200).send({
        nombre: tarea.name,
        estado: tarea.estado,
        trabajador: tarea.trabajador,
        empresa: tarea.empresa,
        id: tarea._id.toString(),
    });
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getTareaId;
