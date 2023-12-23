import mongoose from "npm:mongoose@8.0.1";
import { Conductor } from "../types.ts";
import { Viaje } from "../types.ts";
import ViajeModel from "./viaje.ts";

const Schema = mongoose.Schema;

const conductorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true}, //formato email
    username: { type: String, unique: true, required: true},
    travels: { type: [Schema.Types.ObjectId], required:false, ref: "Viaje", default: []},
    },
  { timestamps: true }
);


//MIDDLEWARES----------------------------
conductorSchema.post("findOneAndDelete", async function (doc: ConductorModelType) {
  await ViajeModel.deleteMany({driver: doc._id}).exec();
  //await ConductorModel.updateMany({travels: doc._id}, {$pull: {travels: doc._id}}).exec();
}
);



export type ConductorModelType = mongoose.Document & Omit<Conductor, "id">;

export default mongoose.model<ConductorModelType>("Conductor", conductorSchema);