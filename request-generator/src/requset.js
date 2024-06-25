import axios  from 'axios';
import FormData from'form-data';
import fs from'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileName='1kb.file';
const filePath = path.join(__dirname, '..','files',fileName);

const fileContent = fs.readFileSync(filePath);

const serverUrl="http://localhost:3000/file";

export default async function(){
    return new Promise((resolve,reject)=>{
        const form = new FormData();
        form.append('file', fileContent,{
          filename: fileName,
        });
        axios.post(serverUrl,form,{
              headers: {
                ...form.getHeaders()
            }
          }
        ).then((response) => {
            let data=response.data;
            resolve(data);
        })
        .catch((error) => {
            reject(new Error(error));
        });
    });
}