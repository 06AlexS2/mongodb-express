const router = require("express").Router();
const Vet = require("./schema");

const { /*create, list, */ getOne, update, erase } = require("../generics");

const entityRoute = "/";
const entity = "vets";

//entonces, aqui en el codigo de controller vets, solo se llama a una variable que a su vez
//llama a listar de los metodos genericos (recordemos que listEntities fue renombrado a list para facilitar su uso)
//const listHandler = list(entity);

//y ya cuando queramos crear el enrutador de metodo listar, solo llamamos a la variable anterior y le damos la ruta de entidad
//correspondiente, en este caso, veterinarios (vets)
//listar veterinarios
router.get(entityRoute, async (req, res) => {
  try {
    const vets = await Vet.find();
    return res.status(200).json(vets);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensaje: error.message });
  }
});

//obtener un solo veterinario sigue el mismo metodo que en listar todos los dueños (anterior)
//const getOneHandler = getOne(entity);
router.get(`${entityRoute}:_id`, async (req, res) => {
  try {
    const { _id } = req.params;
    const vets = await Vet.findById(_id);
    if (vets) {
      return res.status(200).json(vets);
    }
    return res.status(404).json({ mensaje: "vet not found" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensaje: error.message });
  }
});

//crear veterinarios
//const createHandler = create(entity);
router.post(entityRoute, async (req, res) => {
  try {
    const vet = new Vet(req.body);
    await vet.save();
    return res.status(200).json(vet);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ mensaje: error.message });
  }
});

//editar veterinarios
//const updateHandler = update(entity);
router.put(`${entityRoute}:_id`, async (req, res) => {
  try {
    const { _id = null } = req.params;
    const { _id: id, ...newData } = req.body;
    if (!_id) {
      return res.status(400).json({ mensaje: "missing id" });
    }
    //$set es un operador de mongoose que indica setear algo
    const updatedVet = await Vet.findOneAndUpdate(
      { _id },
      { $set: newData },
      { new: true, runValidators: true }
    );
    return res.status(200).json(updatedVet);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ mensaje: error.message });
  }
});

//eliminar veterinarios
router.delete(`${entityRoute}:_id`, async (req, res) => {
  try {
    const { _id = null } = req.params;
    if (!_id) {
      return res.status(400).json({ mensaje: "missing id" });
    }
    //$set es un operador de mongoose que indica setear algo
    const erasedVet = await Vet.findByIdAndDelete({ _id });
    return res.status(204).json({ mensaje: "vet erased" });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ mensaje: error.message });
  }
});

module.exports = router;
