import { Storage } from '@google-cloud/storage';
import path from "path";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keyFilename = path.join(__dirname, '..',process.env.firebaseJsonName);



const storage = new Storage({ keyFilename });
storage.interceptors.push({
  request: function(reqOpts) {
    reqOpts.forever = false
    return reqOpts
  }
})
const bucket = storage.bucket('buket_for_testing');



const toGcpBucket=async (file)=>{
    return new Promise((resolve, reject) => {
      try{
        const filePath = file.path;
        const filename = file.filename;
        const blob = bucket.file(filename);
        const blobStream = blob.createWriteStream({
          resumable: false,
          contentType: file.mimetype,
        });
        blobStream.on('error', (error) => {
          throw new Error(error);
        });
        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          readStream.close();
          // deleteFile(filePath);
          resolve(publicUrl);
        });
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(blobStream);
      }catch(error){
        reject(new Error(error));
      }

    });
}

const arrayFilesUpload=async(arr)=>{
    try{
      for(let i=0;i<arr.length;i++){
        arr[i].cloudStoragePublicUrl=await toGcpBucket(arr[i]);
      }
    }catch(error){
      throw new Error(error);
    }
}

export default async (req,res,next)=>{
  if (!req.file&&!req.files) {
    return res.send('No file uploaded.');
  }
  try{
    if(req.file){
      req.file.cloudStoragePublicUrl=await toGcpBucket(req.file);
    }
    else{
      if(req.files instanceof Array) {await arrayFilesUpload(req.files);}
      else if(typeof(req.files)=="object"){
        for(let i in req.files){
          await arrayFilesUpload(req.files[i]);
        }
      }
    }
    next();
  }catch(error){
    res.json({
      message: error,
    });
  }
} 