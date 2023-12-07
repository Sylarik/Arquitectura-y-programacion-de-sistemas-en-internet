//8. /business - > Deberá devolver todas las empresas

import { Request, Response } from "npm:express@4.18.2";
import EmpresaModel from "../db/empresa.ts";

const getEmpresas = async (req: Request, res: Response) => {
  try {
    
    const empresas = await EmpresaModel.find().populate(["tareas", "trabajadores"]).exec();

    res.status(200).send(
      empresas.map((empresa) => ({
        nombre: empresa.name,
        tareas: empresa.tareas,
        trabajadores: empresa.trabajadores,
        id: empresa._id.toString(),
      }))
    );
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getEmpresas;