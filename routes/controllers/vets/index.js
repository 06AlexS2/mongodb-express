const router = require("express").Router();
const Vet = require("./schema");

const { create, list, getOne, update, erase, filterEntities } = require("../generics");

const entityRoute = "/";

//entonces, aqui en el codigo de controller vets, solo se llama a una variable que a su vez
//llama a listar de los metodos genericos (recordemos que listEntities fue renombrado a list para facilitar su uso)
//const listHandler = list(entity);

//y ya cuando queramos crear el enrutador de metodo listar, solo llamamos a la variable anterior y le damos la ruta de entidad
//correspondiente, en este caso, veterinarios (vets)
//listar veterinarios
const listHandler = list({Model: Vet});
router.get(entityRoute, listHandler);

//obtener un solo veterinario sigue el mismo metodo que en listar todos los dueños (anterior)
const getOneHandler = getOne({Model: Vet});
router.get(`${entityRoute}:_id`, getOneHandler);

//crear veterinarios
const createHandler = create({Model: Vet});
router.post(entityRoute, createHandler);

//editar veterinarios
const updateHandler = update({Model: Vet});
router.put(`${entityRoute}:_id`, updateHandler);

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
