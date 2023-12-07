import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@8.0.1";

import getTrabajadorID from "./resolvers/getTrabajadorID.ts"; //--1
import getEmpresaID from "./resolvers/getEmpresaID.ts"; //--2
import getTareaID from "./resolvers/getTareaID.ts"; //--3
import deleteTrabajador from "./resolvers/deleteTrabajador.ts"; //--4
import deleteEmpresa from "./resolvers/deleteEmpresa.ts"; //--5
import deleteTarea from "./resolvers/deleteTarea.ts"; //--6
import getTrabajadores from "./resolvers/getTrabajadores.ts"; //--7
import getEmpresas from "./resolvers/getEmpresas.ts"; //--8
import getTareas from "./resolvers/getTareas.ts"; //--9

import addTrabajador from "./resolvers/addTrabajador.ts";
import addEmpresa from "./resolvers/addEmpresa.ts";
import addTarea from "./resolvers/addTareas.ts";

import updateEstado from "./resolvers/updateEstado.ts";

import contratarTrabajador from "./resolvers/contratarTrabajador.ts";
import despedirTrabajador from "./resolvers/despedirTrabajador.ts";

import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
const env = await load();

const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL"); //1-> busca en env /2-> archivo del sistema
const PORT = env.PORT || Deno.env.get("PORT") || 3050;


if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);
const app = express();
app.use(express.json());
app
 
  .get("/worker/:id", getTrabajadorID)//--1 
  .get("/business/:id", getEmpresaID)//--2 
  .get("/task/:id", getTareaID)//--3 
  
  .delete("/worker/:id", deleteTrabajador)//--4 
  .delete("/business/:id", deleteEmpresa)//--5 
  .delete("/task/:id", deleteTarea)//--6 
  
  .get("/worker", getTrabajadores)//--7
  .get("/business", getEmpresas)//--8 
   
  .get("/task", getTareas)//--9 
  
  .post("/worker", addTrabajador) //
  .post("/business", addEmpresa) //
  
  .post("/task", addTarea) 
  
  .put("/business/:id/fire/:workerId", despedirTrabajador)  
  .put("/business/:id/hire/:workerId", contratarTrabajador) 

  .put("/task/:id", updateEstado) 

  

app.listen(PORT, () => {
  console.log("Server listening on port 3050");
});

function post(arg0: string,addInvoice: (req: Request,res: Response) => Promise<void>) {
  throw new Error("Function not implemented.");
}
