import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";


import addProducts from "./resolvers/addProducts.ts";
import getProducts from "./resolvers/getProducts.ts";
import deleteProducts from "./resolvers/deleteProduct.ts";

import addCliente from "./resolvers/addClient.ts";
import getCliente from "./resolvers/getClients.ts";
import deleteCliente from "./resolvers/deleteClients.ts";

import addInvoice from "./resolvers/addInvoice.ts";
import getInvoice from "./resolvers/getInvoice.ts";



import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
const env = await load();

const MONGO_URL = "mongodb+srv://sgarciag18:123@cluster0.f9boxcy.mongodb.net/p2_tienda?retryWrites=true&w=majority"



if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);
const app = express();
app.use(express.json());
app
  .get("/products", getProducts) //--
  .post("/products", addProducts) //--1
  .delete("/delete/:id", deleteProducts)

  .get("/products", getCliente) //--
  .post("/products", addCliente) //--
  .delete("/delete/:id", deleteCliente)

  .post("/invoice", addInvoice)
  .get("/invoice/:id", getInvoice);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

function post(arg0: string,addInvoice: (req: Request,res: Response) => Promise<void>) {
  throw new Error("Function not implemented.");
}
