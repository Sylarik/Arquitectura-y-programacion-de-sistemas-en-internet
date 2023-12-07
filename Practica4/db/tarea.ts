import mongoose from "npm:mongoose@8.0.1";
import { ESTADOS, Tarea } from "../types.ts";
import EmpresaModel from "./empresa.ts";
import TrabajadorModel from "./trabajador.ts";

const Schema = mongoose.Schema;

const tareaSchema = new Schema(
  {
    name: { type: String, required: true},
    estado: { type: String, enum: ESTADOS, required: true, default: ESTADOS.to_do}, 
    trabajador: { type: Schema.Types.ObjectId, required:true, ref: "Trabajador"}, 
    empresa: { type: Schema.Types.ObjectId, required:true, ref: "Empresa" }, 
  },
  { timestamps: true }
);

//-----VALIDACIONES----------------
tareaSchema
  .path("trabajador") //de los de arriba cual quieres comprobar
  .validate(async function (trabajador: mongoose.Types.ObjectId) {
    const validateTrabajador = await TrabajadorModel.find({_id: trabajador}).exec();
    if(!validateTrabajador){
      throw new Error("El trabajador no existe");
    }
    return true;
    }
);

tareaSchema
  .path("empresa")
  .validate(async function (empresa: mongoose.Types.ObjectId) {
    const validateEmpresa = await EmpresaModel.findOne({_id: empresa}).exec();
    if(!validateEmpresa){
      throw new Error("La empresa no existe");
    }
    return true;
  }
);

//-------MIDDLEWARES----------------
tareaSchema.post("save", async function (doc: TareaModelType) {
  //cuando se guarde una tarea queremos:
  //1 . actualizar las tareas de trabajador y añadir esta
  //2. actualizar las tareas de empresa y añadir esta

  await EmpresaModel.findOneAndUpdate({_id: doc.empresa}, {$push: {tareas: doc._id}}).exec();
  await TrabajadorModel.findOneAndUpdate({_id: doc.trabajador}, {$push: {tareas: doc._id}}).exec();

  //$push -> para añadir algo a un array 

}
);

//-------DELETE-------------
tareaSchema.post("findOneAndDelete", async function (doc: TareaModelType) {
  //cuando se borre una tarea queremos:
  //1 . actualizar las tareas de trabajador y borrar esta
  //2. actualizar las tareas de empresa y borrar esta

  await EmpresaModel.findOneAndUpdate({_id: doc.empresa}, {$pull: {tareas: doc._id}}).exec();
  await TrabajadorModel.findOneAndUpdate({_id: doc.trabajador}, {$pull: {tareas: doc._id}}).exec();

  //$pull -> para quitar algo de un array 

});

tareaSchema.post("findOneAndUpdate", async function (doc: TareaModelType) {
 try{
    if(doc.estado === "closed"){
      await doc.deleteOne();
      await TrabajadorModel.findOneAndUpdate({_id: doc.trabajador}, {$pull: {tareas: doc._id}}).exec();
      await EmpresaModel.findOneAndUpdate({_id: doc.empresa}, {$pull: {tareas: doc._id}}).exec();
    }

 }catch(error){
    throw new Error("La tarea no existe");
  }

});

export type TareaModelType = mongoose.Document & Omit<Tarea, "id">;

export default mongoose.model<TareaModelType>("Tarea", tareaSchema);
