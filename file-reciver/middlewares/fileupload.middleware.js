import multer from "multer"
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let ds='uploads/'
      cb(null, ds); 
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = uuidv4();
      const extension = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${extension}`);
    }
});

const upload = multer({ storage: storage });

export default upload;