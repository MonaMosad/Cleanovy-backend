// models/service.model.js
<<<<<<< HEAD
// import mongoose from "mongoose";
const mongoose = require("mongoose");
=======
const mongoose = require("mongoose");

>>>>>>> origin/main
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },
  },
  { timestamps: true }
);

<<<<<<< HEAD
// export default mongoose.model("Service", serviceSchema);
module.exports = mongoose.model("Service", serviceSchema);
=======
const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
>>>>>>> origin/main
