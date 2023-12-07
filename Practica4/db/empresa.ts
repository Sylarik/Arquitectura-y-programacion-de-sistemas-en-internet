import mongoose from "npm:mongoose@8.0.1";
import { Empresa } from "../types.ts";
import TrabajadorModel from "./trabajador.ts";
import EmpresaModel from "./empresa.ts"; //VER SI ESTA BIEN
import TareaModel from "./tarea.ts";

const Schema = mongoose.Schema;

const empresaSchema = new Schema(
  {
    name: { type: String, required: true, unique: true},
    tareas :  { type: [Schema.Types.ObjectId], required:false, ref: "Tarea"}, //ver si funciona poner asi el array
    trabajadores : { type: [Schema.Types.ObjectId], required:false, ref: "Trabajador" }, //ver si funciona poner asi el array
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


//-----MIDDLEWARES------------------------------------
//antes de guardar empresa debo
//1. comprobar que el trabajador existen
//2. comprobar que la empresa existe
//2. comprobar que los trabajadores no tienen empresa
//3. comprobar que no tiene mas de 10 trabajadores

//actualizar la empresa con el cliente o elimar al cliente del array de clientes


/*
//actulaizar el cliente con la empresa o eliminar la empresa
empresaSchema.pre("findOneAndUpdate", async function (next) {
  const miTrabajador = await TrabajadorModel.findOne({_id: .trabajadores}).exec();
  if(!miTrabajador){
    throw new Error("El trabajador no existe opjoo");
  }

  const miEmpresa = await EmpresaModel.findOne({_id: next._id}).exec();
  if(!miEmpresa){
    throw new Error("La empresa no existe");
  }

  if(miTrabajador.empresa){
    throw new Error("El trabajador ya tiene empresa");
  }

  if(miEmpresa.trabajadores.length === 10){
    throw new Error("La empresa ya tiene 10 trabajadores");
  }
  
  next(); 
});
*/
/*
empresaSchema.post("findOneAndUpdate", async function (next) {

  const miTrabajador = await TrabajadorModel.findOne({_id: this.trabajadores}).exec();
  if(!miTrabajador){
    throw new Error("El trabajador no existe");
  }


  miTrabajador.empresa = miEmpresa._id;
  await miTrabajador.save();
  
  next(); 
});
*/

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