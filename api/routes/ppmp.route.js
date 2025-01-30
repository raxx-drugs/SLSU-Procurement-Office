import express from 'express';
import { createPPMP, listPPMP } from '../controllers/ppmp.controller.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './api/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() 
      // Replace spaces in the original filename with underscores
      const sanitizedFileName = file.originalname.replace(/\s+/g, '_');
      cb(null, uniqueSuffix + '_' + sanitizedFileName);
    }
  })
  
  const upload = multer({ storage: storage })


// Route for creating a new PPMP with file upload
router.post('/', upload.single('file'), createPPMP);

// Route for fetching all papers
router.get("/", listPPMP);

export default router;
