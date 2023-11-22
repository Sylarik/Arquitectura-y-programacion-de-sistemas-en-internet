import ClienteModel from "../db/cliente.ts";

setInterval(async () => {
    const clientes = await ClienteModel.find().exec();

    clientes.map(async (miCliente) => {
        miCliente.dinero = miCliente.dinero + 10000;
        const mensaje = "Se ha añadido 10000€ a tu cuenta";
        miCliente.historial.push(mensaje);
        await ClienteModel.findOneAndUpdate(
            {_id: miCliente._id},
            {dinero: miCliente.dinero, historial: miCliente.historial},
            {new: false}
        ).exec();
    })
}, 5*60*1000) 