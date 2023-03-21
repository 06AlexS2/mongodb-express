const { list, getOne, create, update, erase } = require("../../data-handler");
const { v4: uuidv4 } = require("uuid");
const lodash = require("lodash");

//mediante un closure de una funcion, podemos recortar la redaccion de features
/* closureList es una funcion que obtiene la entidad
y con ella, encapsula o encierra la subfuncion closureHandlerList, que es la que se encarga
asíncronamente de enlistar la entidad en cuestion */
const listEntities = function closureList(entity) {
  return async function closureHandlerList(req, res) {
    if (!entity) {
      res.status(404).json({ mensaje: "not found" });
    }
    const _entity = await list({ entityDir: entity });
    return res.status(200).json(_entity);
  };
};

const getOneEntity = function closureSingleEntityList(entity) {
  return async function closureHandlerSingleEntityList(req, res) {
    const { _id = null } = req.params;
    if (!_id) {
      return res.status(400).json({ mensaje: "missing id" });
    }
    if (!entity) {
      res.status(404).json({ mensaje: "not found" });
    }
    const _entity = await getOne({ entityDir: entity, fileName: _id });
    if (_entity) {
      return res.status(200).json(_entity);
    }
    res.status(404).json({ mensaje: "no encontrado" });
  };
};

const createEntity = function closureCreateEntity(entity) {
  return async function closureHandlerCreateEntity(req, res) {
    if (!entity) {
      res.status(404).json({ mensaje: "not found" });
    }
    //si hay datos en el body y si el body no está vacio en algun campo
    if (req.body && Object.keys(req.body).length > 0) {
      //crear un identificador unico para cada json de mascota
      const _id = uuidv4();
      //con el fin de que el id se integre al cuerpo del json, copiamos el req.body a un nuevo objeto, y le agregamos el _id
      const newEntity = { ...req.body, _id };
      //petCreated es lo que se envia
      const entityCreated = await create({
        entityDir: entity,
        fileName: _id,
        dataSave: newEntity,
      });
      res.status(200).json(entityCreated);
    }
    return res.status(400).json({ mensaje: "missing body" });
  };
};

const editEntity = function closureEditEntity(entity) {
  return async function closureHandlerEditEntity(req, res) {
    //verificar que exista el _id, con el fin de verificar si existen mascotas
    const { _id = null } = req.params;
    if (!_id) {
      return res.status(400).json({ mensaje: "missing id" });
    }
    if (!entity) {
      res.status(404).json({ mensaje: "not found" });
    }
    //si hay datos en el body y si el body no está vacio en algun campo
    if (req.body && Object.keys(req.body).length > 0) {
      const currentData = { ...req.body, _id };
      const updatedEntity = await update({
        entityDir: entity,
        fileName: _id,
        currentData,
      });
      return res.status(200).json(updatedEntity);
    }
    return res.status(400).json({ mensaje: "missing body" });
  };
};

const deleteEntity = function closureDeleteEntity(entity) {
  return async function closureHandlerDeleteEntity(req, res) {
    //verificar que exista el _id, con el fin de verificar si existen mascotas
    const { _id = null } = req.params;
    if (!_id) {
      return res.status(400).json({ mensaje: "missing id" });
    }
    if (!entity) {
      res.status(404).json({ mensaje: "not found" });
    }
    await erase({ entityDir: entity, fileName: _id });
    return res.status(204).send();
  };
};

const filterEntities = (Model, query) => {
  //yo no puedo mutar las propiedades de primer nivel o las superficiales, pero las mas internas si
  //esto genera problemas porque a veces no vemos las mutaciones porque seguro esta muy lejos de donde la estamos iniciando
  //para resolver esto usamos lodash.cloneDeep()
  let queryResult = lodash.cloneDeep(query);
  for (let key of Object.keys(queryResult)) {
    //con lodash, podemos obtener el valor del objeto sin mutarlo independientemente de su profundidad
    const instance = lodash.get(Model, `schema.paths.${key}.instance`, null);
    //si no hay instancia tipada, saltate el query
    if (instance === null) {
      queryResult[key] = undefined;
      continue;
    }
    if (
      instance === "ObjectId" ||
      instance === "Date" ||
      instance === "Number"
    ) {
      continue;
    }

    queryResult[key] = { $regex: query[key], $options: "i" };
  }
  return queryResult;
};

//se exporta listEntities como listar cuando se use fuera en otros controllers
module.exports = {
  list: listEntities,
  getOne: getOneEntity,
  create: createEntity,
  update: editEntity,
  erase: deleteEntity,
  filterEntities,
};
