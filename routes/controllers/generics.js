const { erase } = require("../../data-handler");
const { v4: uuidv4 } = require("uuid");
const lodash = require("lodash");

//mediante un closure de una funcion, podemos recortar la redaccion de features
/* closureList es una funcion que obtiene la entidad
y con ella, encapsula o encierra la subfuncion closureHandlerList, que es la que se encarga
asíncronamente de enlistar la entidad en cuestion */
//el metodo actualizado generico para listar utiliza el modelo, que por defecto es null y el metodo populate, que
//por defecto devuelve un array vacio
const listEntities = function closureList({ Model = null, populate = [] }) {
  return async function closureHandlerList(req, res) {
    try {
      if (!Model) {
        throw new Error("Model not sent");
      }
      const filter = filterEntities(Model, req.query);
      let listPromise = Model.find(filter);
      //dado que no usamos typescript podemos modificar la estructura del parametro populate
      if (Array.isArray(populate) && populate.length > 0) {
        for (const nestedEntity of populate) {
          listPromise = listPromise.populate(nestedEntity);
        }
      }

      const result = await listPromise;
      return res.status(200).json(result);
    } catch (error) {
      console.log({ error });
      return res.status(500).json({ mensaje: error.message });
    }
  };
};

const getOneEntity = function closureSingleEntityList({ Model = null }) {
  return async function closureHandlerSingleEntityList(req, res) {
    try {
      if (!Model) {
        throw new Error("Model not sent");
      }
      const { _id } = req.params;
      const entity = await Model.findById(_id);
      if (entity) {
        return res.status(200).json(entity);
      }
      return res.status(404).json({ mensaje: "resource not found" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ mensaje: error.message });
    }
  };
};

const createEntity = function closureCreateEntity({ Model = null }) {
  return async function closureHandlerCreateEntity(req, res) {
    try {
      if (!Model) {
        throw new Error("Model not sent");
      }
      if (!req.body) {
        return res.status(400).json({ mensaje: "missing body" });
      }
      if (!Object.keys(req.body).length) {
        return res.status(400).json({ mensaje: "missing body" });
      }
      const { _id, ...remainingEntityData } = req.body;
      const entity = new Model(remainingEntityData);
      await entity.save();
      return res.status(200).json(entity);
    } catch (error) {
      console.log({ error });
      return res.status(500).json({ mensaje: error.message });
    }
  };
};

const editEntity = function closureEditEntity({ Model = null }) {
  return async function closureHandlerEditEntity(req, res) {
    try {
      if (!Model) {
        throw new Error("Model not sent");
      }
      const { _id = null } = req.params;
      const { _id: id, ...newData } = req.body;
      if (!_id) {
        return res.status(400).json({ mensaje: "missing id" });
      }
      //$set es un operador de mongoose que indica setear algo
      const updatedEntity = await Model.findOneAndUpdate(
        { _id },
        { $set: newData },
        { new: true, runValidators: true }
      );
      if (!updatedEntity) {
        return res.status(404).json({ mensaje: "not found" });
      }
      return res.status(200).json(updatedEntity);
    } catch (error) {
      console.log({ error });
      return res.status(500).json({ mensaje: error.message });
    }
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
