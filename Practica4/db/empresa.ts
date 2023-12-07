import mongoose from "npm:mongoose@8.0.1";
import { Empresa } from "../types.ts";
import TrabajadorModel from "./trabajador.ts";
import EmpresaModel from "./empresa.ts"; //VER SI ESTA BIEN
import TareaModel from "./tarea.ts";

const Schema = mongoose.Schema;

const empresaSchema = new Schema(
  {
    name: { type: String, required: true, unique: true},
    tareas :  { type: [Schema.Types.ObjectId], required:false, ref: "Tarea"}, 
    trabajadores : { type: [Schema.Types.ObjectId], required:false, ref: "Trabajador" }, 
  },
  { timestamps: true }
);


///------------------VALIDACIONES---------------------
empresaSchema
  .path("trabajadores")
  .validate(async function (trabajadores: mongoose.Types.ObjectId[]) {
    const validateTrabajador = await TrabajadorModel.find({_id: trabajadores}).exec();
    if(!validateTrabajador){
      throw new Error("El trabajador no existe onininh");
    }
    if (trabajadores.length === 10) {
      throw new Error("No puede tener mas de 10 trabajadores");
    }
    return true;
    }
  );
//----------------------------------------------------

//-----DELETE-----------------------
empresaSchema.post("findOneAndDelete", async function (doc: EmpresaModelType) {
  //aqui queremos actualizar:
  //1. eliminar la empresa de los trabajadores
  //2. eliminar la empresa de las tareas 

  await TrabajadorModel.updateMany({_id: {$in: doc.trabajadores}}, {empresa: null}).exec();
  await TareaModel.updateMany({_id: {$in: doc.tareas}}, {empresa: null}).exec();
  //$in -> buscamos de la tabla de todos los trabajadores ls que esten dentro del array de trabajadores de la empresa
  //es updateMany porque queremos actualizar varios de los trabajadores de una empresa

});
//----------------------------------

export type EmpresaModelType = mongoose.Document & Omit<Empresa, "id">;

export default mongoose.model<EmpresaModelType>("Empresa", empresaSchema);
