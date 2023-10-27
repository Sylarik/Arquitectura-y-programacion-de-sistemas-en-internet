import { Request, Response } from "npm:express@4.18.2";
import PersonajeIdModel from "../db/personajes.ts";

const getPersonajeId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;  //es lo que pones depues para bscar en google
    const personaje = await PersonajeIdModel.findOne({_id: id}).exec();
    if (!personaje) {
        res.status(404).send("Personaje no encontrado");
        return;
    }

    res.status(200).send({
        nombre: personaje.nombre,
        raza: personaje.raza,
        descripcion: personaje.descripcion,
        habilidades: personaje.habilidades,
        id: personaje._id.toString(),
    });
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getPersonajeId;