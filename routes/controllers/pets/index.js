const router = require("express").Router();
const Pet = require("./schema");

const { /*create, list, */ getOne, update, erase, filterEntities } = require("../generics");

const entityRoute = "/";
const entity = "pets";

//entonces, aqui en el codigo de controller pets, solo se llama a una variable que a su vez
//llama a listar de los metodos genericos (recordemos que listEntities fue renombrado a list para facilitar su uso)
//const listHandler = list(entity);

//y ya cuando queramos crear el enrutador de metodo listar, solo llamamos a la variable anterior y le damos la ruta de entidad
//correspondiente, en este caso, mascotas (pets)
//listar mascotas
router.get(entityRoute, async (req, res) => {
  try {
    const filter = filterEntities(Pet, req.query);
    const pets = await Pet.find(filter).populate("owner");
    return res.status(200).json(pets);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensaje: error.message });
  }
});

//obtener una sola mascota sigue el mismo metodo que en listar todas las mascotas (anterior)
//const getOneHandler = getOne(entity);
router.get(`${entityRoute}:_id`, async (req, res) => {
  try {
    const { _id } = req.params;
    const pets = await Pet.findById(_id);
    if (pets) {
      return res.status(200).json(pets);
    }
    return res.status(404).json({ mensaje: "pet not found" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensaje: error.message });
  }
});

//crear mascotas
//const createHandler = create(entity);
router.post(entityRoute, async (req, res) => {
  try {
    const pet = new Pet(req.body);
    await pet.save();
    return res.status(200).json(pet);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ mensaje: error.message });
  }
});

//editar mascotas
//const updateHandler = update(entity);
router.put(`${entityRoute}:_id`, async (req, res) => {
  try {
    const { _id = null } = req.params;
    const { _id: id, ...newData } = req.body;
    if (!_id) {
      return res.status(400).json({ mensaje: "missing id" });
    }
    //$set es un operador de mongoose que indica setear algo
    const updatedPet = await Pet.findOneAndUpdate(
      { _id },
      { $set: newData },
      { new: true, runValidators: true }
    );
    return res.status(200).json(updatedPet);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ mensaje: error.message });
  }
});

//eliminar mascotas
router.delete(`${entityRoute}:_id`, async (req, res) => {
  try {
    const { _id = null } = req.params;
    if (!_id) {
      return res.status(400).json({ mensaje: "missing id" });
    }
    //$set es un operador de mongoose que indica setear algo
    const erasedPet = await Pet.findByIdAndDelete({ _id });
    return res.status(204).json({ mensaje: "pet erased" });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ mensaje: error.message });
  }
});

module.exports = router;
