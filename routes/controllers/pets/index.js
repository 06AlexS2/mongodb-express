const router = require("express").Router();
const Pet = require("./schema");

const {
  create,
  list,
  getOne,
  update,
  erase,
  filterEntities,
} = require("../generics");

const entityRoute = "/";

//entonces, aqui en el codigo de controller pets, solo se llama a una variable que a su vez
//llama a listar de los metodos genericos (recordemos que listEntities fue renombrado a list para facilitar su uso)
//const listHandler = list(entity);

//y ya cuando queramos crear el enrutador de metodo listar, solo llamamos a la variable anterior y le damos la ruta de entidad
//correspondiente, en este caso, mascotas (pets)
//listar mascotas
const listHandler = list({ Model: Pet, populate: ["owner"] });
router.get(entityRoute, listHandler);

//obtener una sola mascota sigue el mismo metodo que en listar todas las mascotas (anterior)
//const getOneHandler = getOne(entity);
const getOneHandler = getOne({ Model: Pet });
router.get(`${entityRoute}:_id`, getOneHandler);

//crear mascotas
const createHandler = create({ Model: Pet });
router.post(entityRoute, createHandler);

//editar mascotas
const updateHandler = update({ Model: Pet });
router.put(`${entityRoute}:_id`, updateHandler);

//eliminar mascotas
const deleteHandler = erase({ Model: Pet });
router.delete(`${entityRoute}:_id`, deleteHandler);

module.exports = router;
