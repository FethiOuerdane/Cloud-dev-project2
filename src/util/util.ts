import fs from "fs";
import Jimp = require("jimp");
const axios = require('axios').default;
// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // code for getting Buffer is 
      // from https://www.fabiofranchino.com/log/get-the-image-buffer-using-axios-and-nodejs/
      const response = await axios(inputURL, { responseType: 'arraybuffer' })
      const buffer64 = Buffer.from(response.data, 'binary')
     // Now using the Buffer to serve it to JIMP
      const photo = await Jimp.read(buffer64);
      const outpath =
        "/tmp/filtered" + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath
          , (img) => {
         // console.log(__dirname + outpath);
          resolve(__dirname + outpath);
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
