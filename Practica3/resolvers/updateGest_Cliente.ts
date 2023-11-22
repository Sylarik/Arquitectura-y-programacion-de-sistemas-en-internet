//1. buscar id cliente
//2. buscar id gestor
    //3. si el gestor tiene mas 10 clientes error
//4. añadir cliente al gestor

//comprobar que el cliente no tiene gestor


import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/cliente.ts";
import GestorModel from "../db/gestor.ts";

const updateGest_Cliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; //id del cliente
    const {gestor } = req.body; //id del gestor
    if (!gestor) {
      res.status(400).send("Se encesitan el gestor");
      return;
    }

    //compruebo que existe el cliente y gestor
    const miCliente = await ClienteModel.findOne({_id: id }).exec();
    if (!miCliente) {
      res.status(400).send("Cliente no exists");
      return;
    }
    const miGestor = await GestorModel.findOne({_id: gestor }).exec();
    if (!miGestor) {
      res.status(400).send("Gestor no exists");
      return;
    }

    //ver si gestor ya no puede tener mas clientes
    if(miGestor.clientes.length === 10){
      res.status(400).send("Gestor no puede tener mas de 10 clientes");
      return;
    }

    //comprobar que el cliente no tiene gestor
    if(miCliente.gestor !== ""){
      res.status(400).send("Cliente ya tiene gestor");
      return;
    }

    //añadir cliente al gestor
    miGestor.clientes.push(miCliente.id);

    

    //update de cliente y gestor
    const updatedCliente = await ClienteModel.findOneAndUpdate(
      { _id : id },
      { gestor: gestor },
      
      { new: true }
    ).exec();
    const updatedGestor = await GestorModel.findOneAndUpdate(
        { _id : gestor },
        { clientes: miGestor.clientes},
        
        { new: true }
    ).exec();

    if (!updatedCliente) {
      res.status(404).send("Cliente no encontrado");
      return;
    }
    if (!updatedGestor) {
      res.status(404).send("Gestor no encontrado");
      return;
    }

    res.status(200).send({
      
      cliente: updatedCliente._id.toString(),
      nombrecliente: updatedCliente.name,
      gestor: updatedCliente.gestor,
      nombregestor: updatedGestor.name,
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default updateGest_Cliente;

