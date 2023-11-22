import HipotecaModel from "../db/hipoteca.ts";
import ClienteModel from "../db/cliente.ts";

setInterval(async ()=> {
    const hipotecas = await HipotecaModel.find().exec(); //buscar todas las hipotecas
    
    await hipotecas.reduce(async (hipoAntigua, miHipoteca) =>{   //es con reduce para que me haga la amortizacion en todas las hipotecas

        await hipoAntigua; //que espere a que se haya pagado la cuota de la anterior hipoteca
        
        const miCliente = await ClienteModel.findOne({_id: miHipoteca.cliente }).exec();
        if (!miCliente) {  
        return;
        }
        
        //cuanto dinero paga cada vez
        const dividendo = miHipoteca.importe / miHipoteca.cuota;

        //comprobar que el cliente tiene dinero suficiente
        if(miCliente.dinero < dividendo){
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
        await HipotecaModel.findOneAndDelete({ _id: miHipoteca }).exec();
        miCliente.historial.push("Ya has terminado de pagar la hipoteca " + miHipoteca._id);
        }

        //update de los saldos de los dos clientes
        const updatedSaldoCliente = await ClienteModel.findOneAndUpdate(
        { _id : miCliente },
        { dinero: dineroActualCliente , historial: miCliente.historial},
        
        { new: true }
        ).exec();

        const updatedSaldoHipoteca = await HipotecaModel.findOneAndUpdate(
            { _id : miHipoteca },
            { importe: importeActualizado, cuota: cuotasRestantes },
            
            { new: true }
        ).exec();

        //comprobar q se han actualizado los saldos
        if (!updatedSaldoCliente) {
        return;
        }
        if (!updatedSaldoHipoteca) {
            return;
        }

    }, Promise.resolve())
}, 0.5*60*1000)
