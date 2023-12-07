//14. /business/:id/hire/:workerId -> Deberá contratar de la empresa al trabajador que corresponde al id

import { Request, Response} from "npm:express@4.18.2";
import TrabajadorModel from "../db/trabajador.ts";
import EmpresaModel from "../db/empresa.ts";

const contratarTrabajador = async (req: Request, res: Response) => {
  try {
    const { id, workerId } = req.params; //id del cliente

    const alreadyExists = await EmpresaModel.findOne({ _id: id }).exec();
    if (!alreadyExists) {
      res.status(404).send("Empresa no encontrado");
      return;
    }

    await EmpresaModel.findOneAndUpdate(
        { _id : id },
        { $push: { trabajadores: workerId } },
        { new: true }
    ).exec();

    await TrabajadorModel.findOneAndUpdate(
        { _id : workerId },
        { $push: { empresa: id } },
        { new: true }
    ).exec();


   

    res.status(200).send();
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default contratarTrabajador;