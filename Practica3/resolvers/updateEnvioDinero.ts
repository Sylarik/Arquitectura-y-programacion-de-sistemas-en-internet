//1. coger el id del cliente q quiere enviar dinero
    //comprobar q tiene dinero suficiente
//2. buscar id cliente al que queremos enviar dinero
    //comprobar q existe, si no error
//3. restar dinero al cliente q envia
//4. sumar dinero al cliente q recibe
//5. actualizar historial de ambos

import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/cliente.ts";


const updateEnvioDinero = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; //id del cliente q envia dinero
    const {receptor, dinero} = req.body; //id del cliente q recibe dinero y dinero q recibe
    if (!dinero || !receptor) {
      res.status(400).send("Se encesitan cuanto tanto el emisor como el importe");
      return;
    }

    //comprobar q existe el cliente q envia dinero
    const miEmisor = await ClienteModel.findOne({_id: id }).exec();
    if (!miEmisor) {
      res.status(400).send("Cliente no exists");
      return;
    }
    const miReceptor = await ClienteModel.findOne({_id: receptor }).exec();
    if (!miReceptor) {
      res.status(400).send("Cliente no exists");
      return;
    }

    //comprobar q el emisor tiene dinero suficiente
    if (miEmisor.dinero < dinero) {
        res.status(400).send("No tienes dinero suficiente");
        return;
    }

    //hacemos el envio de dinero
    const dineroActualEmisor =  miEmisor.dinero - dinero;
    const dineroActualReceptor = miReceptor.dinero + dinero;

    //actualizar historial del cliente
    miEmisor.historial.push("Se ha enviado " + dinero + "€ a " + miReceptor.name);
    miReceptor.historial.push("Se ha recibido " + dinero + "€ de " + miEmisor.name);

    //update de los saldos de los dos clientes
    const updatedSaldoEmisor = await ClienteModel.findOneAndUpdate(
      { _id : id },
      { dinero: dineroActualEmisor , historial: miEmisor.historial },
      
      { new: true }
    ).exec();
    const updatedSaldoReceptor = await ClienteModel.findOneAndUpdate(
        { _id : receptor },
        { dinero: dineroActualReceptor , historial: miReceptor.historial },
        
        { new: true }
    ).exec();

    //comprobar q se han actualizado los saldos
    if (!updatedSaldoEmisor) {
      res.status(404).send("no se ha podido actualizar el saldo del emisor");
      return;
    }
    if (!updatedSaldoReceptor) {
        res.status(404).send("no se ha podido actualizar el saldo del receptor");
        return;
    }

    res.status(200).send({
        receptor: updatedSaldoReceptor.name,
        idReceptor: updatedSaldoReceptor._id.toString(),
        dineroReceptor: updatedSaldoReceptor.dinero,
        emisor: updatedSaldoEmisor.name,
        idEmisor: updatedSaldoEmisor._id.toString(),
        dineroEmisor: updatedSaldoEmisor.dinero,
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default updateEnvioDinero;

