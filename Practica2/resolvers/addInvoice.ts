import { Request, Response } from "npm:express@4.18.2";
import FacturaModel from "../db/invoices.ts";
import ClienteModel from "../db/clients.ts";
import ProductoModel from "../db/products.ts";

const addFactura = async (req: Request, res: Response) => {
  try {
    const { client, products, total } = req.body;
    if (!client || !products || !total) {
      res.status(400).send("Se requieren todos los parametros");
      return;
    }

    //para ver si existe el id del cliente en los clientes 
    const existingCliente = await ClienteModel.findOne({ _id: client }).exec();
    if (!existingCliente) {
      res.status(400).send("El cliente no existe en la base de datos");
      return;
    }

    //para comprobar que los productos que metemos en la factura exiten
    const productoExiste =await Promise.all(
      products.map(async (element:string) => {
        const existingProduct = await ProductoModel.findOne({ name: element });
        return existingProduct;
      })
    );

    if (productoExiste.some((product) => !product)) {
      res.status(400).send("Alguno de los productos no existe en la base de datos");
      return;
    }


    //para que en la factura salga el nombre del cliente y que nos sea mas facil ver quien es
    const nombre = existingCliente.name;

    const newFactura = new FacturaModel({ client, products, total });
    await newFactura.save();

    res.status(200).send({
      
      client_name: nombre,
      client: newFactura.client,
      products: newFactura.products,
      total: newFactura.total,
      id: newFactura._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addFactura;