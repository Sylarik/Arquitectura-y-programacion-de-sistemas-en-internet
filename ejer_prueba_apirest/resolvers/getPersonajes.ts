import { Request, Response } from "npm:express@4.18.2";
import PersonajeModel from "../db/personajes.ts";

const getPersonaje = async (req: Request, res: Response) => {
  try {
    //const { dni } = req.params;  es lo que pones depues para bscar en google
    const personajes = await PersonajeModel.find().exec();
    
    res.status(200).send(personajes);
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getPersonaje;
