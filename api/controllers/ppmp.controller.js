import PPMP from '../models/ppmp.model.js';
import multer from 'multer';

// Create a new PPMP with uploaded file
export const createPPMP = async (req, res) => {
    try {
        const { unit, title } = req.body;
        const fileData = req.file ? `${req.file.filename}` : null;  // Set file URL
        console.log(fileData)

        const newPPMP = new PPMP({
            unit,
            title,
            fileData,  // Can store the file path here
        });

        await newPPMP.save();
        res.status(201).json(newPPMP);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const listPPMP = async (req,res,next) => {
    try {

        const ppmps = await PPMP.find({});
        res.status(200).json({
            message: "List of PPMPs fetched successfully!",
            data: ppmps
        });
    } catch (error) {
        console.log(error);
        //Send an error response if something goes wrong
        next(errorHandler(500, "Something went wrong while fetching the data from database!"));
    }
}