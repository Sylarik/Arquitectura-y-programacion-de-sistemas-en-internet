import { Request, Response } from "npm:express@4.18.2";
import GestorModel from "../db/gestor.ts";


const addGestor = async (req: Request, res: Response) => {
    try {
        const { name, clientes, dni } = req.body;
        if (!name || !dni) {
            res.status(400).send("Se necesita todos los datos");
            return;
        }

        const newGestor = new GestorModel({ name, clientes, dni });
        await newGestor.save();

        res.status(200).send({
            name: newGestor.name,
            clientes: newGestor.clientes,
            dni: newGestor.dni,
            id: newGestor._id.toString(),
        });
    } catch (error) {
        res.status(500).send(error.message);
        return;
    }
};

export default addGestor;