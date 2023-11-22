//1. buscar cliente con el id del q se quiere añadir dinero
    //si no existe error
//2. sumar dinero al cliente
//3. actualizar historial


import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/cliente.ts";


const updateSaldoCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {dinero} = req.body;
    if (!dinero) {
      res.status(400).send("Se encesitan cuanto dinero quieres añadir");
      return;
    }

    const miCliente = await ClienteModel.findOne({_id: id }).exec();
    if (!miCliente) {
      res.status(400).send("Cliente no exists");
      return;
    }

    const dineroActual = miCliente.dinero;
    const dineroNuevo = dineroActual + dinero;

    //actualizar historial del cliente
    miCliente.historial.push("Se ha añadido " + dinero + "€ a tu cuenta"); //-------------------------

    const updatedSaldo = await ClienteModel.findOneAndUpdate(
      { _id : id },
      { dinero: dineroNuevo , historial: miCliente.historial},
    
      { new: true }
    ).exec();

    if (!updatedSaldo) {
      res.status(404).send("no se ha podido actualizar el saldo");
      return;
    }

    res.status(200).send({
        nombre: updatedSaldo.name,
        dni: updatedSaldo.dni,
        dinero: updatedSaldo.dinero,
        gestor: updatedSaldo.gestor,
        hipotecas: updatedSaldo.hipotecas,
        historial: updatedSaldo.historial,
        id: updatedSaldo._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default updateSaldoCliente;

