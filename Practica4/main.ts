import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@8.0.1";

/*
import addCliente from "./resolvers/addClient.ts"; //--1
import deleteCliente from "./resolvers/deleteClients.ts"; //--2
import updateSaldoCliente from "./resolvers/updateSaldoCliente.ts"; //--4

import updateEnvioDinero from "./resolvers/updateEnvioDinero.ts"; //--3
import amortizarHipoteca from "./resolvers/updateHip_Cliente.ts"; //--6
import updateGest_Cliente from "./resolvers/updateGest_Cliente.ts"; //--8

import addHipoteca from "./resolvers/addHipoteca.ts"; //--5
import addGestor from "./resolvers/addGestor.ts"; //--7
*/

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

//import "./resolvers/ingresar5min.ts";
//import "./resolvers/amortizar5min.ts";

import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
const env = await load();

const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL"); //1-> busca en env /2-> archivo del sistema
const PORT = env.PORT || Deno.env.get("PORT") || 3050;

//validaciones -> crear las cosas o modificarlas
//midelwares -> pre y post -> 
//populate -> para que te devuelva los datos de la otra tabla (con los gets)



if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);
const app = express();
app.use(express.json());
app
  
  //HACER:
  //controlers
  //validaciones


  .get("/worker/:id", getTrabajadorID)//--1 si va con populate tmb
  .get("/business/:id", getEmpresaID)//--2 si va con populate tmb
  .get("/task/:id", getTareaID)//--3 si va con populate tmb
  
  .delete("/worker/:id", deleteTrabajador)//--4 validacion  se supone q bien
  .delete("/business/:id", deleteEmpresa)//--5 validacion se supone q bien
  .delete("/task/:id", deleteTarea)//--6 validacion
  
  .get("/worker", getTrabajadores)//--7 creo q va con populate tmb
  .get("/business", getEmpresas)//--8 creo q va con populate tmb
   
  .get("/task", getTareas)//--9 si va con populate tmb
  
  .post("/worker", addTrabajador) //si
  .post("/business", addEmpresa) //si
  
  .post("/task", addTarea) //si, y se añade a empresa y a trabajdor
  
  .put("/business/:id/fire/:workerId", despedirTrabajador)  //si pero no con mideleware
  .put("/business/:id/hire/:workerId", contratarTrabajador) //si pero no con mideleware

  .put("/task/:id", updateEstado) //si pero no puedo dos a la vez

  

app.listen(PORT, () => {
  console.log("Server listening on port 3077");
});

function post(arg0: string,addInvoice: (req: Request,res: Response) => Promise<void>) {
  throw new Error("Function not implemented.");
}
