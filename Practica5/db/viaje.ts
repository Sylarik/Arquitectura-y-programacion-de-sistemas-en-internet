import mongoose from "npm:mongoose@8.0.1";
import { Viaje } from "../types.ts";
import { ESTADO } from "../types.ts";
import ClienteModel from "./cliente.ts";
import { Cliente } from "../types.ts";
import { Conductor } from "../types.ts";
import ConductorModel from "./conductor.ts";

const Schema = mongoose.Schema;

const viajeSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, required: true},
    driver: { type: Schema.Types.ObjectId, required: true},
    money: { type: Number, required: true, min: [5, 'minimo tiene que ser 5 euros']},  // min 5
    distance: { type: Number, requierd: true, min: [0.01, 'la distancia minima son 0.01km']}, //km
    date: { type: String, required: true},
    status: { type: String, enum: Object.values(ESTADO), required: false, default: ESTADO.ACTIVO}, //enum?????
    },
  { timestamps: true }
);


//VALIDACIONES


//Un viaje solamente se puede crear, si ambos están disponibles, y el cliente tiene dinero
// ver que en el array de los dos el ultimo viaje no es activo
//ver que el cliente tenga el dinero minimo

viajeSchema
    .path('client')
    .validate(async function (client: mongoose.Types.ObjectId) {
        const cliente = await ClienteModel.findOne({_id: client}).exec();
        if(!cliente){
            return false;
        }
        
        const ultimoViaje = cliente.travels && cliente.travels.length > 0 ? cliente.travels[cliente.travels.length - 1] : null;

        //ver si el ultimo viaje esta activo
        if(ultimoViaje?.status == "activo"){
            return false;
        }

        const tarjeta_valida = cliente.cards.find((tarjeta) => {
            if(tarjeta.money >= this.money){
                return true;
            }
            else{
                throw new Error(`No tienes dinero suficiente en la tarjeta`), {
            }
        }
    },)
    })
    
viajeSchema
    .path('driver')
    .validate(async function (driver: mongoose.Types.ObjectId) {
        const conductor = await ConductorModel.findOne({_id: driver}).exec();
        if(!conductor){
            return false;
        }
        
        const ultimoViaje = conductor.travels && conductor.travels.length > 0 ? conductor.travels[conductor.travels.length - 1] : null;

        //ver si el ultimo viaje esta activo
        if(ultimoViaje?.status == "activo"){
            return false;
        }
    })



//MIDDLEWARES
viajeSchema.post("save", async function (doc: ViajeModelType) {
    const cliente = await ClienteModel.findOne({_id: doc.client}).exec();
    const conductor = await ConductorModel.findOne({_id: doc.driver}).exec();
    if(cliente && conductor){
        cliente.travels?.push(doc._id);

        cliente.cards.forEach((tarjeta) => {
            if(tarjeta.money >= doc.money){
                tarjeta.money -= doc.money;
            }
        });
        
        conductor.travels.push(doc._id);
        await cliente.save();
        await conductor.save();
    }

});

viajeSchema.pre("deleteMany", async function () {
   //eliminar de conductor.travels el id de todos los viajes que se van a borrar
    const viajes = await this.model.find(this.getFilter()); // Obtener los viajes que se van a borrar
    const viajesIds = viajes.map(viaje => viaje._id); // Obtener los IDs de los viajes

    // Actualizar todos los conductores
    await ConductorModel.updateMany({}, { $pullAll: { travels: viajesIds } });
    await ClienteModel.updateMany({}, { $pullAll: { travels: viajesIds } });
});

export type ViajeModelType = mongoose.Document & Omit<Viaje, "id">;

export default mongoose.model<ViajeModelType>("Viaje", viajeSchema);