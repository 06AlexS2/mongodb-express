//los schemas de mongoose necesitan la libreria de mongoose
const mongoose = require("mongoose");
//vamos a obtener una clase que se llama schema desde mongoose
const { Schema } = mongoose;

//declarar un nuevo objeto de la clase schema
const ownerSchema = new Schema(
  {
    ownerName: {
      type: String,
      required: true,
    },
    ownerLName: {
      type: String,
      required: true,
    },
    ownerDoc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, }
);

module.exports = mongoose.model("owners", ownerSchema);
