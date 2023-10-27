import { Request, Response } from "npm:express@4.18.2";
import PersonajeModel from "../db/personajes.ts";

const addPersonaje = async (req: Request, res: Response) => {
  try {
    const { nombre, raza, descripcion, habilidades } = req.body;
    if (!nombre || !raza || !descripcion || !habilidades) {
      res.status(500).send("Se requieren todos los parametros");
      return;
    }
    if(raza!="Hobbit" && raza!="Humano" && raza!="Elfo" && raza!="Enano" && raza!="Ent"){
      res.status(500).send("La raza no se encuentra entre las existentes");
      return;
    }

    /*
    const alreadyExists = await PersonajeModel.findOne({ nombre }).exec();
    if (alreadyExists) {
      res.status(400).send("Ese personaje ya existe");
      return;
    }
    */

    const newPersonaje = new PersonajeModel({ nombre, raza, descripcion, habilidades });
    await newPersonaje.save();

    res.status(200).send({
      nombre: newPersonaje.nombre,
      raza: newPersonaje.raza,
      descripcion: newPersonaje.descripcion,
      habilidades: newPersonaje.habilidades,
      id: newPersonaje._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addPersonaje;
