//archivo para crear archivos
const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "data");
const dataHandler = {

    create: async ({
        entityDir = "pets",
        fileName,
        dataSave,
      }) => {
        try {
          const fullPath = `${baseDir}/${entityDir}/${fileName}.json`;
          console.log(fullPath);
          const fileDescriptor = await fs.promises.open(
            fullPath,
            "wx"
          );
          const stringData = JSON.stringify(dataSave);
          await fs.promises.writeFile(fileDescriptor, stringData);
          return dataSave;
        } catch (error) {
          return error;
        }
    },

    getOne: async ({ entityDir = "pets", fileName, addExtension = true }) => {
        try {
            let file = null;
            if(addExtension) {
                file = `${baseDir}/${entityDir}/${fileName}.json`;
            }
            else {
                file = `${baseDir}/${entityDir}/${fileName}`;
            }
            const result = await fs.promises.readFile(file, {encoding: "utf-8"});
            const JSONresult = JSON.parse(result);
            return JSONresult;
        } catch (error) {
            return new Error("file can not be read or it does not exist.");
        }
        
    },

    list: async ({ entityDir="pets" }) => {

        try {
            let files = await fs.promises.readdir(`${baseDir}/${entityDir}/`);
            files = files.filter((file) => file.includes(".json"));
            const promisesArrayReadFile = files.map((file) => {
                return dataHandler.getOne({
                    entityDir, 
                    fileName: file, 
                    addExtension: false
                });
            });
            let pluralDataFiles = await Promise.all(promisesArrayReadFile);
            return pluralDataFiles;
        } catch (error) {
            return new Error(`Error while attempting to list from ${baseDir}`);
        }
    },

    erase: async ({ entityDir = "pets", fileName }) => {
        try {
          const fullPath = `${baseDir}/${entityDir}/${fileName}.json`;
          const doesFileExist = fs.existsSync(fullPath);
          if (!doesFileExist) {
            throw new Error(`La entidad con id = ${fileName} no existe`);
          }
          const deleteResult = await fs.promises.unlink(fullPath);
          return { mensaje: true };
        } catch (error) {
          return error;
        }
    },

    update: async ({
        entityDir = "pets",
        fileName,
        currentData,
      }) => {
        try {
            const fullPath = `${baseDir}/${entityDir}/${fileName}.json`;
            const doesFileExist = fs.existsSync(fullPath);

            if(!doesFileExist) {
                throw new Error(`the entity with id= ${fileName} does not exists`);
            }

            //verificamos datos que tenemos antes de obtener el objeto
            const previousJSONData = await dataHandler.getOne({
                entityDir,
                fileName,
            });
            //eliminar para regenerar el archivo
            const deleteResult = await fs.promises.unlink(fullPath);
            console.log({deleteResult});
            
            const fileDescriptor = await fs.promises.open(fullPath, "wx");
            //si hay un dato que no le este mandando, al asignarle spread operator a los datos de guardado y a los datos previos
            //en JSON me aseguro que no llegue el campo vacio o null
            const finalDataSave = {...previousJSONData, ...currentData}
            const stringData = JSON.stringify(finalDataSave);
            await fs.promises.writeFile(fileDescriptor, stringData);
            return finalDataSave;
        } catch (error) {
            return error;
        }
    },

}

module.exports = dataHandler;