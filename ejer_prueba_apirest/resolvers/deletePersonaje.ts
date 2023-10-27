import { Request, Response } from "npm:express@4.18.2";
import PersonajeModel from "../db/personajes.ts";

const deletePersonaje = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const persoanje = await PersonajeModel.findOneAndDelete({ _id: id }).exec();
    if (!persoanje) {
      res.status(404).send("el personaje no existe");
      return;
    }
    res.status(200).send("personaje borrado");
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deletePersonaje;
