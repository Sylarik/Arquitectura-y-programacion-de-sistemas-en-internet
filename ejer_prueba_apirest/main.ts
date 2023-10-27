import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";


import addPersonaje from "./resolvers/addPersonaje.ts";
//import deleteProducts from "./resolvers/deleteProduct.ts";

//import addCliente from "./resolvers/addClient.ts";
import getPersonaje from "./resolvers/getPersonajes.ts";
import getPersonajeId from "./resolvers/getPersonajesId.ts";
import deletePersonaje from "./resolvers/deletePersonaje.ts";
import updatePersonaje from "./resolvers/updatePersonaje.ts";


import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
const env = await load();

const MONGO_URL = "mongodb+srv://sgarciag18:123@cluster0.f9boxcy.mongodb.net/tierra_media?retryWrites=true&w=majority"



if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);
const app = express();
app.use(express.json());
app
  .get("/api/tierramedia/personajes", getPersonaje) //--
  .get("/api/tierramedia/personajes/:id", getPersonajeId)
  
  .post("/api/tierramedia/personajes", addPersonaje) //--
  .delete("/api/tierramedia/personajes/:id", deletePersonaje)
  .put( "/api/tierramedia/personajes/:id", updatePersonaje)

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
