const fs = require("node:fs/promises");
const path = require("node:path");
const pc = require("picocolors");

//valido la ruta actual o la que desee revisar
const folfer = process.argv[2] ?? ".";

async function ls(folder) {
  let files;

  try {
    files = await fs.readdir(folder); // leo la ruta que recibi
  } catch {
    console.error(pc.red("No se puede leer el directorio " + folder));
    process.exit(1);
  }

  // recorro y optengo la ruta junto con el archivo
  const filePromises = files.map(async (file) => {
    const filePath = path.join(folder, file);
    let stats;

    try {
      stats = await fs.stat(filePath); // tomo la informacion del archivo

      const isDirectory = stats.isDirectory();
      const fileType = isDirectory ? "Directory: " : "File:";
      const fileSize = stats.size.toString().padStart(10);
      const fileModified = stats.mtime.toLocaleString();

      // retorno toda la informacion del archivo o directorio
      return `${fileType} ${pc.blue(file.padEnd(15))} ${fileSize > 100 ? pc.red(fileSize) : pc.green(fileSize)} ${fileModified}`;
    } catch (error) {
      console.error("No se pudo leer el archivo " + filePath);
      process.exit(1);
    }
  });

  // espero la promesa con toda la info del archivo
  const filesInfo = await Promise.all(filePromises);

  // recorro y muestro la informacion de cada archivo en la ruta
  filesInfo.forEach((fileInfo) => {
    console.log(fileInfo);
  });
}

// llamo la funcion 
ls(folfer);