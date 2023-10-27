import { Request, Response } from "npm:express@4.18.2";
import PersonajeModel from "../db/personajes.ts";

const updatePersonaje = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, raza, descripcion, habilidades } = req.body;
    if (!nombre || !raza || !descripcion ||!habilidades) {
      res.status(400).send("Se encesitan todos los requisitos");
      return;
    }

    const updatedPersonaje = await PersonajeModel.findOneAndUpdate(
      { _id : id },
      { nombre, raza, descripcion, habilidades },
      
      { new: true }
    ).exec();

    if (!updatedPersonaje) {
      res.status(404).send("Persoanje no encontrado");
      return;
    }

    res.status(200).send({
      nombre: updatedPersonaje.nombre,
      raza: updatedPersonaje.raza,
      descripcion: updatedPersonaje.descripcion,
      habilidades: updatedPersonaje.habilidades,
      id: updatedPersonaje._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default updatePersonaje;