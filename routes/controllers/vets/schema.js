//los schemas de mongoose necesitan la libreria de mongoose
const mongoose = require("mongoose");
//vamos a obtener una clase que se llama schema desde mongoose
const { Schema } = mongoose;

//declarar un nuevo objeto de la clase schema
const vetSchema = new Schema(
  {
    vetName: {
      type: String,
      required: true,
    },
    vetLName: {
      type: String,
      required: true,
    },
    vetLicense: {
      type: String,
      required: true,
    },
    vetCountry: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("vets", vetSchema);
