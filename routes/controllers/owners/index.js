const router = require("express").Router();
const Owner = require("./schema");

const { /*create, list, */ getOne, update, erase } = require("../generics");

const entityRoute = "/";
const entity = "owners";

//entonces, aqui en el codigo de controller owners, solo se llama a una variable que a su vez
//llama a listar de los metodos genericos (recordemos que listEntities fue renombrado a list para facilitar su uso)
//const listHandler = list(entity);

//y ya cuando queramos crear el enrutador de metodo listar, solo llamamos a la variable anterior y le damos la ruta de entidad
//correspondiente, en este caso, mascotas (owners)
//listar dueños
router.get(entityRoute, async (req, res) => {
  try {
    const owners = await Owner.find();
    return res.status(200).json(owners);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensaje: error.message });
  }
});

//obtener un solo duño sigue el mismo metodo que en listar todos los dueños (anterior)
//const getOneHandler = getOne(entity);
router.get(`${entityRoute}:_id`, async (req, res) => {
  try {
    const { _id } = req.params;
    const owners = await Owner.findById(_id);
    if (owners) {
      return res.status(200).json(owners);
    }
    return res.status(404).json({ mensaje: "owner not found" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensaje: error.message });
  }
});

//crear dueños
//const createHandler = create(entity);
router.post(entityRoute, async (req, res) => {
  try {
    const owner = new Owner(req.body);
    await owner.save();
    return res.status(200).json(owner);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ mensaje: error.message });
  }
});

//editar dueños
//const updateHandler = update(entity);
router.put(`${entityRoute}:_id`, async (req, res) => {
  try {
    const { _id = null } = req.params;
    const { _id: id, ...newData } = req.body;
    if (!_id) {
      return res.status(400).json({ mensaje: "missing id" });
    }
    //$set es un operador de mongoose que indica setear algo
    const updatedOwner = await Owner.findOneAndUpdate(
      { _id },
      { $set: newData },
      { new: true, runValidators: true }
    );
    return res.status(200).json(updatedOwner);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ mensaje: error.message });
  }
});

//eliminar dueños
router.delete(`${entityRoute}:_id`, async (req, res) => {
  try {
    const { _id = null } = req.params;
    if (!_id) {
      return res.status(400).json({ mensaje: "missing id" });
    }
    //$set es un operador de mongoose que indica setear algo
    const erasedOwner = await Owner.findByIdAndDelete({ _id });
    return res.status(204).json({ mensaje: "owner erased" });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ mensaje: error.message });
  }
});

module.exports = router;
