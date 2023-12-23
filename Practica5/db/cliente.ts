import mongoose from "npm:mongoose@8.0.1";
import { Cliente } from "../types.ts";
import { Tarjeta } from "../types.ts";
import { Viaje } from "../types.ts";
import ViajeModel from "./viaje.ts";
import ConductorModel from "./conductor.ts";

const Schema = mongoose.Schema;

const clienteSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true}, //formato email
    cards: { type: [{
        number: { type: String, required: true}, //formato tarjeta
        cvv: { type: Number, required: true}, 
        expiration: {type: String, required: true}, //MM/YYYY
        money: {type: Number, required: false, default: 0},
        }], required: false , default: []},
    travels: { type: [Schema.Types.ObjectId], required:false, ref: "Viaje", default: []},
  },
  { timestamps: true }
);


//FORMATO EMAIL CORRECTO
clienteSchema
    .path('email')
    .validate(async function (email: string) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(email); // Assuming email has a text attribute
        }
    );

//FORMATO NUMERO DE UNA TARJETA CORRECTA
clienteSchema
    .path('cards.number')
    .validate(async function (number: String) {
        //const numero = number.toString();
        if(number.length != 16){
            return false;
        }
        return true
        /*const numberRegex = /^[0-9]{16}$/;
        return numberRegex.test(number.toString());*/ // Assuming email has a text attribute
        }
    );

//FORMATO CVV CORRECTO
clienteSchema
    .path('cards.cvv')
    .validate(async function (cvv: number) {
        const cvv_string = cvv.toString();
        if(cvv_string.length != 3){
            return false;
        }
        return true;
        /*const cvvRegex = /^[0-9]{3}$/;
        return cvvRegex.test(cvv.toString()); */ // Assuming email has a text attribute
        }
    );

//FORMATO FECHA MM/YYYY CORRECTO
clienteSchema
    .path('cards.expiration')
    .validate(async function (expiration: string) {
        const expirationRegex = /^(0[1-9]|1[0-2])\/([0-9]{4})$/;
        return expirationRegex.test(expiration); // Assuming email has a text attribute
        }
    );


//MIDDLEWARES----------------------------
clienteSchema.post("findOneAndDelete", async function (doc: ClienteModelType) {
    await ViajeModel.deleteMany({client: doc._id}).exec();
    //await ConductorModel.updateMany({travels: doc._id}, {$pull: {travels: doc._id}}).exec();
}
);

export type ClienteModelType = mongoose.Document & Omit<Cliente, "id">;

export default mongoose.model<ClienteModelType>("Cliente", clienteSchema);


