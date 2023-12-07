//4. /worker/:id -> Eliminará el trabajador que corresponde al id

import { Request, Response } from "npm:express@4.18.2";
import TrabajadorModel from "../db/trabajador.ts";

const deleteTrabajador = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trabajador = await TrabajadorModel.findOneAndDelete({ _id: id }).exec();
    if (!trabajador) {
      res.status(404).send("el trabajador no existe");
      return;
    }

    res.status(200).send("trabajador borrado");
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deleteTrabajador;
