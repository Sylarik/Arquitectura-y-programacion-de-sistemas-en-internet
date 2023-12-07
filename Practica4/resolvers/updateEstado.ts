//15. /task/:id?status=x -> Cambiara el estado de una tarea


import { Request, Response } from "npm:express@4.18.2";
import TareaModel from "../db/tarea.ts";


const updateEstado = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const status = req.query.status;

    const updateTarea = await TareaModel.findOneAndUpdate({_id: id}, {estado: status}).exec();
    if (!updateTarea) {
        res.status(404).send("Tarea no encontrado");
        return;
    }

    res.status(200).send({
        nombre: updateTarea.name,
        estado: updateTarea.estado,
        trabajador: updateTarea.trabajador,
        empresa: updateTarea.empresa,
        id: updateTarea._id.toString(),
       
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default updateEstado;