//11. /business - > Deberá crear una empresa
import { Request, Response } from "npm:express@4.18.2";
import EmpresaModel from "../db/empresa.ts";

const addEmpresa = async (req: Request, res: Response) => {
  try {
    const { name} = req.body;

    const newEmpresa = new EmpresaModel({ name});
    await newEmpresa.save();

    res.status(200).send({
      name: newEmpresa.name,
      id: newEmpresa._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addEmpresa;