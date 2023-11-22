import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";


import addCliente from "./resolvers/addClient.ts"; //--1
import deleteCliente from "./resolvers/deleteClients.ts"; //--2
import updateSaldoCliente from "./resolvers/updateSaldoCliente.ts"; //--4

import updateEnvioDinero from "./resolvers/updateEnvioDinero.ts"; //--3
import amortizarHipoteca from "./resolvers/updateHip_Cliente.ts"; //--6
import updateGest_Cliente from "./resolvers/updateGest_Cliente.ts"; //--8

import addHipoteca from "./resolvers/addHipoteca.ts"; //--5
import addGestor from "./resolvers/addGestor.ts"; //--7

//import "./resolvers/ingresar5min.ts";
//import "./resolvers/amortizar5min.ts";

import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
const env = await load();

const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL"); //1-> busca en env /2-> archivo del sistema
const PORT = env.PORT || Deno.env.get("PORT") || 3077;


if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);
const app = express();
app.use(express.json());
app
  
  .post("/client", addCliente) //--1
  .delete("/client/:id", deleteCliente) //--2
  .post("/hipoteca", addHipoteca) //--5
  .post("/gestor", addGestor) //--7
  .put("/client/:id", updateSaldoCliente) //--4
  .put("/receptor/:id", updateEnvioDinero) //--3
  .put("/amortizar/:id", amortizarHipoteca) //--6
  .put("/anadirgestora/:id", updateGest_Cliente) //--8

app.listen(PORT, () => {
  console.log("Server listening on port 3077");
});

function post(arg0: string,addInvoice: (req: Request,res: Response) => Promise<void>) {
  throw new Error("Function not implemented.");
}
