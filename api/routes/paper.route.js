import express from "express";
import { 
    createPaperPPMP, fetchAllPPMP, fetchByUnitPPMP, fetchByIdPPMP, updatePPMP, deletePPMP,
    createPaperPr, fetchAllPR, fetchByUnitPR, fetchByIdPR, updatePR, deletePR,
    restoreFile, fetchTimelinesByPr, fetchByUnitNotification, updateNotification

} from "../controllers/paper.controller.js";
import multer from 'multer';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() 
      // Replace spaces in the original filename with underscores
      const sanitizedFileName = file.originalname.replace(/\s+/g, '_');
      cb(null, uniqueSuffix + '_' + sanitizedFileName);
    }
  })
  
  const upload = multer({ storage: storage })

const router = express.Router();

// Router for PPMP
router.post("/ppmp",upload.single('file'), createPaperPPMP);
router.get("/ppmp", fetchAllPPMP);
router.get("/ppmp/unit/:unit", fetchByUnitPPMP);
router.get("/ppmp/:id", fetchByIdPPMP);
router.put("/ppmp/:id",upload.single('file'), updatePPMP);
router.delete("/ppmp/:id", deletePPMP);


router.post("/pr",upload.single('file'), createPaperPr);
router.get("/pr", fetchAllPR);
router.get("/pr/unit/:unit", fetchByUnitPR); 
router.get("/pr/:id", fetchByIdPR); 
router.put("/pr/:id",upload.single('file'), updatePR);
router.delete("/pr/:id", deletePR);

router.put("/restore/:id", restoreFile);

router.get("/timeline/pr/:prNo", fetchTimelinesByPr);


router.get("/notification/unread/unit/:unit", fetchByUnitNotification); 
router.put("/notification/read/unit/:id", updateNotification);

export default router;