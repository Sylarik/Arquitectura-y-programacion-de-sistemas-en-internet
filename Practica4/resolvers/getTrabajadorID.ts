//1. /worker/:id Devolverá el trabajador que corresponde al id
//@ts.ignore
import { Request, Response } from "npm:express@4.18.2";
import TrabajadorIdModel from "../db/trabajador.ts";

const getTrabajadorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;  //es lo que pones depues para bscar en google

    const trabajador = await TrabajadorIdModel.findOne({_id: id}).populate(["tareas", "empresa"]).exec(); //se pone como esta en el schema
    if (!trabajador) {
        res.status(404).send("Trabajador no encontrado");
        return;
    }

    res.status(200).send({
        nombre: trabajador.name,
        tareas: trabajador.tareas,
        empresa: trabajador.empresa,
        id: trabajador._id.toString(),
    });
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getTrabajadorId;