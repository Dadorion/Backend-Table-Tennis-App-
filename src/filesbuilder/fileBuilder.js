import fs from 'file-system'

function convertToCamelCase(variableName) {
   const words = variableName.split(' ');
   const camelCaseName = words.map((word, index) => {
      if (index === 0) {
         return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
   }).join('');

   return camelCaseName;
}

class fsBuilder {

   async createFile(newPath, content) {

      fs.writeFile(newPath, content, (e) => {
         if (e) {
            console.error(e)
            return
         }
         console.log('file created')
      })
   }

   async readFileContent(filePath) {
      try {
         const content = await fs.promises.readFile(filePath, 'utf-8');
         return content;
      } catch (err) {
         console.error(err);
         return null;
      }
   }
}

const instance = new fsBuilder

async function writeFileFromPromise(sourcePath, targetFilePath) {
   try {
      const fileContent = await instance.readFileContent(sourcePath);
      if (fileContent !== null) {
         await fs.promises.writeFile(targetFilePath, fileContent);
         console.log(`Содержимое файла успешно скопировано в ${targetFilePath}.`);
      } else {
         console.log('Не удалось прочитать файл.');
      }
   } catch (err) {
      console.error(err);
   }
}
// writeFileFromPromise(sourcePath, newPath)
const name = 'chart'
// ${name}
const array = [
   {
      fileName: `${name} router`,
      dirName: 'routers',
      sourcePath: './routers/PlayerRouter.js'
   },
   {
      fileName: `${name} controller`,
      dirName: 'controllers',
      sourcePath: './controllers/PlayerControllers.js'
   },
   {
      fileName: `${name} service`,
      dirName: 'services',
      sourcePath: './services/templateService.js'
   }
]

array.forEach(el => {
   const fileNameCC = convertToCamelCase(el.fileName)
   const dirNameCC = convertToCamelCase(el.dirName)
   const newPath = `./${dirNameCC}/${fileNameCC}.js`
   try {
      writeFileFromPromise(el.sourcePath, newPath)
   } catch (e) {
      console.log(e)
   }
});
