//5. /business/:id -> Eliminará la empresa que corresponde al id

import { Request, Response } from "npm:express@4.18.2";
import EmpresaModel from "../db/empresa.ts";

const deleteEmpresa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const empresa = await EmpresaModel.findOneAndDelete({ _id: id }).exec();
    if (!empresa) {
      res.status(404).send("la empresa no existe");
      return;
    }
    res.status(200).send("empresa borrado");
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deleteEmpresa;
