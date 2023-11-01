import { Request, Response } from "npm:express@4.18.2";
import FacturaModel from "../db/products.ts";

const getFactura = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const factura = await FacturaModel.findOne({_id : id}).exec();
    
    if(!factura){
        res.status(400).send("esa factura no existe");
        return;
    }

    res.status(200).send(factura);
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getFactura;
