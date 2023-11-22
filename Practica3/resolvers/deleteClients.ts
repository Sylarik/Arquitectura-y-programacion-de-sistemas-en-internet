import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/cliente.ts";
import GestorModel from "../db/gestor.ts";

const deleteCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cliente = await ClienteModel.findOne({ _id: id }).exec();
    if (!cliente) {
      res.status(404).send("Cliente not found");
      return;
    }

    //ver si tiene hipotecas que pagar -> si tiene no se puede borrar el cliente
    if (cliente.hipotecas.length > 0) {
      res.status(404).send("Cliente todavia tiene hipotecas");
      return;
    }

    //borrar cliente
    await ClienteModel.findOneAndDelete({ _id: id }).exec();

    //quitar cliente de gestor
    //1. buscar gestor con ese id
    //2. buscar cliente en su array de clientes
    
    const gestor = await GestorModel.findOne({ _id: cliente.gestor }).exec();
    if(gestor){
      const este = gestor.clientes.indexOf(id);
      //borrar del array clientes de gestor el que tenga el mismo id
      if(este){
        //const index = gestor.clientes.indexOf(este);
        gestor.clientes.splice(este, 1);
        await gestor.save();
      }

    }else{
      res.status(404).send("Gestor not found");
      return;
    }



    //borrar cliente
    await ClienteModel.findOneAndDelete({ _id: id }).exec();

    res.status(200).send("Cliente deleted");
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deleteCliente;
