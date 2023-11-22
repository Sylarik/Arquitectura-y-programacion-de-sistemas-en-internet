//1. buscar id cliente que tiene q pagar
//2. buscar id hipoteca que quiere pagar
    //si no existe error
//3. calcular dinero del mes -> si no tiene dinero suficiente error
//4. restar dinero al cliente
//5. restar dinero a la hipoteca
    //si la hipoteca se paga (si esta a 0), borrarla de array de hipotecas del cliente
//6. actualizar historial


import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/cliente.ts";
import HipotecaModel from "../db/hipoteca.ts";

const amortizarHipoteca = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; //id del cliente
    const {hipoteca} = req.body;
    if (!hipoteca) {
      res.status(400).send("Se encesitan la hipoteca que quieres amortizar");
      return;
    }

    //compruebo que existe el cliente e hipoteca
    const miCliente = await ClienteModel.findOne({_id: id }).exec();
    if (!miCliente) {
      res.status(400).send("Cliente no exists");
      return;
    }
    const miHipoteca = await HipotecaModel.findOne({_id: hipoteca }).exec();
    if (!miHipoteca) {
      res.status(400).send("Hipoteca no exists");
      return;
    }
    
    //cuanto dinero paga cada vez
    const dividendo = miHipoteca.importe / miHipoteca.cuota;

    //comprobar que el cliente tiene dinero suficiente
    if(miCliente.dinero < dividendo){
        res.status(400).send("No tienes dinero suficiente");
        return;
    }

    //calculo dinero actual de la hipoteca
    const importeActualizado = miHipoteca.importe - dividendo;
    const dineroActualCliente = miCliente.dinero - dividendo;
    const cuotasRestantes = miHipoteca.cuota - 1;

    //actualizar historial del cliente
    miCliente.historial.push("Se ha amortizado " + dividendo + "€ de la hipoteca " + miHipoteca._id);

    if(cuotasRestantes === 0){
      //borrar hipoteca del array de hipotecas del cliente
      const index = miCliente.hipotecas.indexOf(miHipoteca._id);
      miCliente.hipotecas.splice(index, 1);
      await miCliente.save();
      //borrar hipoteca
      await HipotecaModel.findOneAndDelete({ _id: hipoteca }).exec();
      miCliente.historial.push("Ya has terminado de pagar la hipoteca " + miHipoteca._id);
  }

    //update de los saldos de los dos clientes
    const updatedSaldoCliente = await ClienteModel.findOneAndUpdate(
      { _id : id },
      { dinero: dineroActualCliente , historial: miCliente.historial},
      
      { new: true }
    ).exec();

    const updatedSaldoHipoteca = await HipotecaModel.findOneAndUpdate(
        { _id : hipoteca },
        { importe: importeActualizado, cuota: cuotasRestantes },
        
        { new: true }
    ).exec();


    //comprobar q se han actualizado los saldos
    if (!updatedSaldoCliente) {
      res.status(404).send("no se ha podido actualizar el saldo del cliente");
      return;
    }
    if (!updatedSaldoHipoteca) {
        res.status(404).send("no se ha podido actualizar el saldo de la hipoteca");
        return;
    }


    res.status(200).send({
        cliente: updatedSaldoCliente.name,
        idCliente: updatedSaldoCliente._id.toString(),
        dineroCliente: updatedSaldoCliente.dinero,
        hipoteca: updatedSaldoHipoteca._id.toString(),
        importeHipoteca: updatedSaldoHipoteca.importe,
        cuotaHipoteca: updatedSaldoHipoteca.cuota,
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default amortizarHipoteca;

