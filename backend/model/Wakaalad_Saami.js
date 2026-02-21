import mongoose from "mongoose";

const Wakaalad_SaamiSchema = new mongoose.Schema(
  {

    accountHormuud: {                 // with hormuud share acount 310110....
      type: Number,
     
    },
    accountSalaam: {          // with salaam bank 4121......
      type: Number,
     
    },
    Date: {
      type: Date,
    },

}

);

export default mongoose.model("Wakaalad_Saami", Wakaalad_SaamiSchema);
