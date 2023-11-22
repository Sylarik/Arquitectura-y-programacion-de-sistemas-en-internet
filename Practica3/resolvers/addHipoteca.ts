import { Request, Response } from "npm:express@4.18.2";
import HipotecaModel from "../db/hipoteca.ts";
import ClienteModel from "../db/cliente.ts";
import GestorModel from "../db/gestor.ts";

const addHipoteca = async (req: Request, res: Response) => {
  try {
    const { cuota, importe, cliente} = req.body;
    if ( !importe || !cliente) {
      res.status(400).send("Se necesita todos los datos");
      return;
    }

    //si existe el cliente
    const miCliente = await ClienteModel.findOne({ _id: cliente }).exec();
    if (!miCliente) {
      res.status(404).send("Cliente no encontrado");
      return;
    }

    //compare if hipoteca has less than 1M
    if(importe > 1000000){
      res.status(404).send("ese importe es demasiado grande");
      return;
    }

    //comrprobar q el cliente tiene ese gestor
    if(miCliente.gestor === ""){
      res.status(404).send("Cliente no tiene gestor, por lo que no se podrá hacer la hipoteca");
      return;
    }

    //comprbar que ese gestor existe
    const miGestor = await GestorModel.findOne({ _id: miCliente.gestor}).exec();
    if (!miGestor) {
      res.status(404).send("Este gestor no existe");
      return;
    }

    //creo la hipoteca
    const newHipoteca = new HipotecaModel({ cuota, importe, cliente, gestor: miGestor._id.toString()});

    await newHipoteca.save();

    //asignar la hipoteca a cliente
    miCliente.hipotecas.push(newHipoteca._id.toString());
    await ClienteModel.findOneAndUpdate(
      { _id : cliente },
      { hipotecas: miCliente.hipotecas },
      //{ new: true }
    ).exec();
    

    
   
    
    res.status(200).send({
        cuota: newHipoteca.cuota,
        importe: newHipoteca.importe,
        cliente: newHipoteca.cliente,
        nombrecliente: miCliente.name,
        gestor: newHipoteca.gestor,
        nombregestor: miGestor.name,
        id: newHipoteca._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addHipoteca;