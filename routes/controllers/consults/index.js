const router = require("express").Router();
const Consult = require("./schema");

const {
  /*create, list, */ getOne,
  update,
  erase,
  filterEntities,
} = require("../generics");

const entityRoute = "/";
const entity = "consults";

//entonces, aqui en el codigo de controller consults, solo se llama a una variable que a su vez
//llama a listar de los metodos genericos (recordemos que listEntities fue renombrado a list para facilitar su uso)
//const listHandler = list(entity);

//y ya cuando queramos crear el enrutador de metodo listar, solo llamamos a la variable anterior y le damos la ruta de entidad
//correspondiente, en este caso, consultas (consults)
//listar consultas
router.get(entityRoute, async (req, res) => {
  try {
    const filter = filterEntities(Consult, req.query);
    const consults = await Consult.find(filter).populate("pet").populate("vet");
    return res.status(200).json(consults);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensaje: error.message });
  }
});

//obtener una sola consulta sigue el mismo metodo que en listar todas (anterior)
//const getOneHandler = getOne(entity);
router.get(`${entityRoute}:_id`, async (req, res) => {
  try {
    const { _id } = req.params;
    const consults = await Consult.findById(_id);
    if (consults) {
      return res.status(200).json(consults);
    }
    return res.status(404).json({ mensaje: "consult not found" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensaje: error.message });
  }
});

//crear consultas
//const createHandler = create(entity);
router.post(entityRoute, async (req, res) => {
  try {
    const consult = new Consult(req.body);
    await consult.save();
    return res.status(200).json(consult);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ mensaje: error.message });
  }
});

//editar consultas
//const updateHandler = update(entity);
router.put(`${entityRoute}:_id`, async (req, res) => {
  try {
    const { _id = null } = req.params;
    const { _id: id, ...newData } = req.body;
    if (!_id) {
      return res.status(400).json({ mensaje: "missing id" });
    }
    //$set es un operador de mongoose que indica setear algo
    const updatedConsult = await Consult.findOneAndUpdate(
      { _id },
      { $set: newData },
      { new: true, runValidators: true }
    );
    return res.status(200).json(updatedConsult);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ mensaje: error.message });
  }
});

//eliminar consultas
router.delete(`${entityRoute}:_id`, async (req, res) => {
  try {
    const { _id = null } = req.params;
    if (!_id) {
      return res.status(400).json({ mensaje: "missing id" });
    }
    //$set es un operador de mongoose que indica setear algo
    const erasedConsult = await Consult.findByIdAndDelete({ _id });
    return res.status(204).json({ mensaje: "consult erased" });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ mensaje: error.message });
  }
});

module.exports = router;

//continuar con la referencia de veterinarios y mascotas
