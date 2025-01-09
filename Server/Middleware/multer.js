import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

export const upload = multer({ storage: storage });

const excelStorage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'./uploads/excel');
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now() + path.extname(file.originalname));
  }
})
const excelFilter = (req, file, cb) => {
  const fileTypes = ['.xls', '.xlsx'];
  const extname = path.extname(file.originalname).toLowerCase();

  if (fileTypes.includes(extname)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only Excel files(.xls,.xlsx) are allowed!'), false); // Reject the file with an error
  }
};


export const  excelUpload = multer({storage:excelStorage,fileFilter:excelFilter});