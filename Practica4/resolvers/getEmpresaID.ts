//2. /business/:id

import { Request, Response } from "npm:express@4.18.2";
import EmpresaIdModel from "../db/empresa.ts";

const getEmpresaId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;  //es lo que pones depues para bscar en google
    const empresa = await EmpresaIdModel.findOne({_id: id}).populate(["tareas", "trabajadores"]).exec();
    if (!empresa) {
        res.status(404).send("Empresa no encontrado");
        return;
    }

    res.status(200).send({
        nombre: empresa.name,
        tareas: empresa.tareas,
        trabajadores: empresa.trabajadores,
        id: empresa._id.toString(),
    });
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getEmpresaId;