//6. /task/:id -> Eliminará la tarea que corresponde al id

import { Request, Response } from "npm:express@4.18.2";
import TareaModel from "../db/tarea.ts";

const deleteTarea = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tarea = await TareaModel.findOneAndDelete({ _id: id }).exec();
    if (!tarea) {
      res.status(404).send("la tarea no existe");
      return;
    }
    res.status(200).send("tarea borrado");
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deleteTarea;
