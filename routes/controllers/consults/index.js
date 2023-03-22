const router = require("express").Router();
const Consult = require("./schema");

const {
  create, list, getOne,
  update,
  erase,
  filterEntities,
} = require("../generics");

const entityRoute = "/";

//entonces, aqui en el codigo de controller consults, solo se llama a una variable que a su vez
//llama a listar de los metodos genericos (recordemos que listEntities fue renombrado a list para facilitar su uso)
//const listHandler = list(entity);

//y ya cuando queramos crear el enrutador de metodo listar, solo llamamos a la variable anterior y le damos la ruta de entidad
//correspondiente, en este caso, consultas (consults)
//listar consultas
const listHandler = list({Model: Consult, populate: ["pet", "vet"]});
router.get(entityRoute, listHandler);

//obtener una sola consulta sigue el mismo metodo que en listar todas (anterior)
const getOneHandler = getOne({Model: Consult});
router.get(`${entityRoute}:_id`, getOneHandler);

//crear consultas
const createHandler = create({Model: Consult});
router.post(entityRoute, createHandler);

//editar consultas
const updateHandler = update({Model: Consult});
router.put(`${entityRoute}:_id`, updateHandler);

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
