import mongoose from "npm:mongoose@8.0.1";
import { Trabajador } from "../types.ts";
import EmpresaModel from "./empresa.ts";
import TareaModel from "./tarea.ts";

const Schema = mongoose.Schema;

const trabajadorSchema = new Schema(
  {
    name: { type: String, required: [true, "El nombre es obligatorio"] },
    tareas : { type: [Schema.Types.ObjectId], required:false, ref: "Tarea"}, 
    empresa : { type: Schema.Types.ObjectId, required:false, ref: "Empresa" },
  },
  { timestamps: true }
);

//------------?????
trabajadorSchema
  .path("tareas")
  .validate(async function (tareas: mongoose.Types.ObjectId[]) {
    if (tareas.length > 10) {
      throw new Error("No puede tener mas de 10 tareas");
    }
    return true;
    }  
  );

//------------------VALIDACIONES---------------------
trabajadorSchema
  .path("empresa")
  .validate(async function (empresa: mongoose.Types.ObjectId) {
    const validateEmpresa = await EmpresaModel.findOne({_id: empresa}).exec();
    if(!validateEmpresa){
      throw new Error("La empresa no existeeeeeeeeeeeeeeee");       //va bien
    }
    if (validateEmpresa.trabajadores.length === 10) {
      throw new Error("No puede tener mas de 10 trabajadores");     //va bien
    }
    return true;
  }
    
);//--------------------------------------------------

//se supone que lo hace 
trabajadorSchema.post("save", async function (doc: TrabajadorModelType) {
  try{
    await EmpresaModel.findOneAndUpdate({_id: doc.empresa}, {$push: {trabajadores: doc._id}}).exec();
  }
  catch(error){
    throw new Error("La empresa no existeppppp");
  }

});


//------DELETE-------------------
trabajadorSchema.post("findOneAndDelete", async function (doc: TrabajadorModelType) {

  await TareaModel.updateMany({_id: {$in: doc.tareas}}, {trabajador: null}).exec();
  await EmpresaModel.findOneAndUpdate({_id: doc.empresa}, {$pull: {trabajadores: doc._id}}).exec();
});
//--------------------------------

export type TrabajadorModelType = mongoose.Document & Omit<Trabajador, "id">;

export default mongoose.model<TrabajadorModelType>("Trabajador", trabajadorSchema);