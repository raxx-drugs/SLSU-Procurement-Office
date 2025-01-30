import DeletedFiles from '../models/deletedFile.model.js';  // Import the DeletedFiles model
import PPMP from "../models/ppmp.model.js";
import Pr_monitor from "../models/prmonitor.model.js";
import Timeline from '../models/timeline.model.js';
import Notifcation from '../models/notification.model.js';
import { errorHandler } from "../utils/error.js";
import activityLog from '../models/activitylog.model.js';

//PPMP
export const createPaperPPMP = async (req, res, next) => {
    const { 
        type, 
        unit, 
        title, 
        fundingSource, 
        ppmpData: { description, qnty, mode, dateStart, dateEnd, estimatedBudget }, 
        status = "Pending", 
        remarks = "No remarks yet", 
        totalEstimatedBudget,file,prUsed
    } = req.body;
    const fileData = req.file ? `${req.file.filename}` : null;  // Set file URL
    console.log(fileData)

    console.log(req.body)
    try {
        if (type !== 'PPMP') {
            return res.status(400).json({ message: "Invalid type provided!" });
        }

        // Validate required fields
        if (!unit || !description || !qnty || !mode || !dateStart || !dateEnd || !estimatedBudget) {
            res.status(400).json({
                data: req.body
            });
        }
        // Ensure all arrays are of equal length
        if (
            !Array.isArray(description) ||
            !Array.isArray(qnty) ||
            !Array.isArray(mode) ||
            !Array.isArray(dateStart) ||
            !Array.isArray(dateEnd) ||
            !Array.isArray(estimatedBudget) ||
            description.length !== qnty.length ||
            description.length !== mode.length ||
            description.length !== dateStart.length ||
            description.length !== dateEnd.length ||
            description.length !== estimatedBudget.length
        ) {
            return next(errorHandler(400, "Invalid data structure: Arrays must have equal lengths!"));
        }
        // Generate an array of 'false' values for prUsed, with the same length as the description array
        const prUsed = description.map(() => false);

        // Calculate the total estimated budget
        const totalEstimatedBudget = estimatedBudget.reduce((sum, budget) => sum + budget, 0);

        // Create the PPMP document
        const newPPMP = new PPMP({
            type,
            unit,
            title: title, // Example title, adjust as needed
            fundingSource, // Example funding source, adjust as needed
            ppmpData: {
                description,
                qnty,
                mode,
                estimatedBudget,
                dateStart,
                dateEnd,
                prUsed,
            },
            status,
            totalEstimatedBudget,
            remarks,
            fileData,
        });
        // Save the document to the database
        const savedPPMP = await newPPMP.save();

        res.status(201).json({
            message: "PPMP created successfully!",
            data: savedPPMP,
        });
       
    } catch (error) {
        console.error("Error while creating PPMP:", error);
        next(errorHandler(500, "Internal Server Error"));
    }
};
export const fetchAllPPMP = async (req, res, next) => {
    try {
        // Fetch all PPMP entries
        const list = await PPMP.find({}).sort({ createdAt: -1 });

        if (list.length === 0) {
            return next(errorHandler(204, "No PPMP entries found!"));
        }

        // Count unique units
        const uniqueUnitsCount = await PPMP.distinct("unit").then(units => units.length);

        // Calculate total estimated budget from all PPMP entries
        const totalBudget = list.reduce((sum, item) => sum + item.totalEstimatedBudget, 0);

        res.status(200).json({
            count: list.length,
            countUnit: uniqueUnitsCount, // Count all unique units in the database
            totalBudget: totalBudget, // Sum all totalEstimatedBudget values
            data: list,
        });
    } catch (error) {
        console.error("Error fetching PPMP data:", error);
        next(errorHandler(500, "Something went wrong while fetching data from the database!"));
    }
};
export const fetchByUnitPPMP = async (req, res, next) => {
    try {
        const { unit } = req.params; // Extract the unit from route parameters

        if (!unit) {
            return next(errorHandler(400, "Unit is required"));
        }

        // Find all PPMP entries for the specified unit
        const list = await PPMP.find({ unit }).sort({ createdAt: -1 });

        if (!list || list.length === 0) {
            return next(errorHandler(204, "No PPMP entries found for the specified unit!"));
        }

        // Calculate total estimated budget for the specified unit
        const totalBudget = list.reduce((sum, item) => sum + item.totalEstimatedBudget, 0);

        return res.status(200).json({
            count: list.length,
            totalBudget,
            data: list,
        });
    } catch (error) {
        console.error("Error fetching PPMP by unit:", error);
        // Send an error response if something goes wrong
        next(errorHandler(500, "Something went wrong while fetching the data from the database!"));
    }
};
export const fetchByIdPPMP = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate the ID format as a MongoDB ObjectId
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return next(errorHandler(400, "Invalid MongoDB ID format. Please check the provided ID."));
        }

        // Fetch the PPMP document by its ID
        const ppmp = await PPMP.findById(id);

        // If no document is found, respond with a 404 error
        if (!ppmp) {
            return next(errorHandler(404, "PPMP document not found!"));
        }

        // If found, return the document with a 200 status
        return res.status(200).json({
            message: "PPMP document fetched successfully!",
            data: ppmp,
        });
    } catch (error) {
        console.error("Error fetching PPMP by ID:", error);
        // Send an error response for any unexpected issues
        next(errorHandler(500, "An error occurred while fetching the document from the database."));
    }
};
export const updatePPMP = async (req, res, next) => {
    const {
        unit,
        type,
        ppmpData, // Contains description, qnty, mode, estimatedBudget, dateStart, dateEnd
        status,
        remarks,
        totalEstimatedBudget,
        fileData,
    } = req.body;

    try {
        console.log(req.body);

        // Validate the type
        if (type !== 'PPMP') {
            return res.status(400).json({ message: "Invalid type provided!" });
        }

        // Validate required fields
        if (!unit || !ppmpData || !ppmpData.description || !ppmpData.qnty || !ppmpData.dateStart || !ppmpData.dateEnd || !ppmpData.estimatedBudget) {
            return next(errorHandler(400, "All required fields must be filled!"));
        }

        // Ensure all arrays in ppmpData have the same length
        const { description, qnty, mode, estimatedBudget, dateStart, dateEnd } = ppmpData;
        if (
            !Array.isArray(description) ||
            !Array.isArray(qnty) ||
            !Array.isArray(mode) ||
            !Array.isArray(dateStart) ||
            !Array.isArray(dateEnd) ||
            !Array.isArray(estimatedBudget) ||
            description.length !== qnty.length ||
            description.length !== mode.length ||
            description.length !== dateStart.length ||
            description.length !== dateEnd.length ||
            description.length !== estimatedBudget.length
        ) {
            return next(errorHandler(400, "Invalid data structure: Arrays in ppmpData must have equal lengths!"));
        }

        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return next(errorHandler(400, "ID is not a valid MongoDB _id. Please check the ID."));
        }

        // Fetch the original document
        const originalPPMP = await PPMP.findById(id);
        if (!originalPPMP) {
            return next(errorHandler(404, "Original PPMP not found!"));
        }

        // Prepare the update data
        const updateData = {
            unit,
            type,
            ppmpData: {
                description,
                qnty,
                mode,
                estimatedBudget,
                dateStart,
                dateEnd,
            },
            status: status || ["Pending"],
            remarks: remarks || "No remarks yet",
            totalEstimatedBudget: totalEstimatedBudget || estimatedBudget.reduce((sum, value) => sum + value, 0),
            fileData: fileData || "example.com/image",
        };

        // Update the document in the database
        const result = await PPMP.findByIdAndUpdate(id, updateData, { new: true });

        // If the result is null, return a 404 error
        if (!result) {
            return next(errorHandler(404, "PPMP entry not found!"));
        }

        // Compare original and updated documents to capture changes
        const changes = [];
        for (const key in result._doc) {
            const originalValue = originalPPMP._doc[key];
            const updatedValue = result._doc[key];

            // Deep comparison for nested objects (e.g., ppmpData)
            if (key === "ppmpData") {
                const ppmpDataChanges = {};
                for (const subKey in updatedValue) {
                    if (JSON.stringify(originalValue[subKey]) !== JSON.stringify(updatedValue[subKey])) {
                        ppmpDataChanges[subKey] = {
                            originalValue: originalValue[subKey],
                            updatedValue: updatedValue[subKey],
                        };
                    }
                }
                if (Object.keys(ppmpDataChanges).length > 0) {
                    changes.push({ field: key, changes: ppmpDataChanges });
                }
            } else if (originalValue !== updatedValue) {
                changes.push({
                    field: key,
                    originalValue: originalValue,
                    updatedValue: updatedValue,
                });
            }
        }

        // Respond with success message and details of changes
        return res.status(200).json({
            message: "PPMP has been updated successfully!",
            changes: changes, // List all changes
            data: result,
        });
    } catch (error) {
        console.error("Error updating PPMP:", error);
        next(errorHandler(500, "Something went wrong while updating the data in the database!"));
    }
};

export const deletePPMP = async (req,res) => {
    try {
        //declare object id using req params
        const { id } = req.params;
        // Find the PPMP document before deleting it
        const ppmpToDelete = await PPMP.findById(id);
        // If the PPMP does not exist, return a 404 error
        if (!ppmpToDelete) {
            return next(errorHandler(404, "PPMP not found!"));
        }
        // Store the deleted file in the DeletedFiles collection before deletion
        const deletedFile = new DeletedFiles({
            unit: ppmpToDelete.unit,
            type: 'PPMP',
            documentData: ppmpToDelete,
            deleteTime: new Date(), // Capture the current time of deletion
        });
        // Save the deleted file information to the database
        await deletedFile.save();
        // Now proceed with deleting the PPMP
        const result = await PPMP.findByIdAndDelete(id);
        // If the deletion was successful, return a success message
        return res.status(200).json({ message: "PPMP has been deleted successfully!" });
    } catch (error) {
        console.log(error);
        //Send an error response if something goes wrong
        next(errorHandler(500, "Something went wrong while deleting the data from database!"));
    }
}

//PR
export const createPaperPr = async (req, res, next) => {
    const {
        unit, type, title, fund_cluster, status, prNo, abc, mode,
        date_approved_pr, date_prepared_resolution, date_resolution_signed,
        date_posting, date_start_canvas, date_finished_canvas, date_prepare_abstract,
        date_completion_abstract, remarks, date_sworn_affidavit, date_prepared_po,
        date_approval_po, date_serving_po, date_conformed_supplier_po, date_posting_award,
        date_delivered, date_supply, remarks_action, file ,selectedItem,
    } = req.body;

    const fileData = req.file ? `${req.file.filename}` : null;  // Set file URL
    console.log(fileData)

    console.log(req.body)
    try {
        if(type !=='Purchase Request'){
            return res.status(400).json({ message: "Invalid type provided!" });
        }
        // Optional: Check if a PPMP is required before adding PR (you had it in the original code)
        const existingPPMP = await PPMP.findOne({ unit });
        if (!existingPPMP) {
            return res.status(401).json({ message: "PPMP is required before adding PR!" });
        }
        // Check if the PR number already exists
        const existingPr = await Pr_monitor.findOne({ _pr_no: prNo });
        if (existingPr) {
            return res.status(400).json({ message: "This PR number is already in the database!" });
        }

        const itemDescriptions = selectedItem.item; // This is now an array
        console.log("Selected Items:", itemDescriptions); // Log the array of selected items

        // Iterate over the selected items and find the index for each one in the PPMP data
        const itemIndices = itemDescriptions.map(itemDescription => {
        const itemIndex = existingPPMP.ppmpData.description.findIndex(desc => desc === itemDescription);
        console.log(`Item: ${itemDescription}, Index: ${itemIndex}`);
        return itemIndex;
        });

        // Check if all items were found
        const invalidItems = itemIndices.filter(index => index === -1);
        if (invalidItems.length > 0) {
        return res.status(400).json({ message: "One or more items were not found in PPMP!" });
        }

        // If all items are found, update the corresponding `prUsed` fields
        await Promise.all(itemIndices.map(itemIndex => {
        return PPMP.findOneAndUpdate(
            { unit, [`ppmpData.description.${itemIndex}`]: existingPPMP.ppmpData.description[itemIndex] }, // Match item by index and description
            { $set: { [`ppmpData.prUsed.${itemIndex}`]: true } } // Update prUsed for each item
        );
        }));


        // Create a new PR entry
        const newPr = new Pr_monitor({
            _pr_no: prNo ,
            _title: title ,
            _abc: abc ,
            _fund_source: fund_cluster ,
            _unit: unit,
            _mode: mode ,
            _date_approved_pr: date_approved_pr || "N/A",
            _date_prepared_resolution: date_prepared_resolution || "N/A",
            _date_resolution_signed: date_resolution_signed || "N/A",
            _date_posting: date_posting || "N/A",
            _date_start_canvas: date_start_canvas || "N/A",
            _date_finished_canvas: date_finished_canvas || "N/A",
            _date_prepare_abstract: date_prepare_abstract || "N/A",
            _date_completion_abstract: date_completion_abstract || "N/A",
            _remarks: remarks || "N/A",
            _date_sworn_affidavit: date_sworn_affidavit || "N/A",
            _date_prepared_po: date_prepared_po || "N/A",
            _date_approval_po: date_approval_po || "N/A",
            _date_serving_po: date_serving_po || "N/A",
            _date_conformed_supplier_po: date_conformed_supplier_po || "N/A",
            _date_posting_award: date_posting_award || "N/A",
            _date_delivered: date_delivered || "N/A",
            _date_supply: date_supply || "N/A",
            _status: status || "N/A",
            _remarks_action: remarks_action || "N/A",
            _fileData: fileData || null, // For binary file storage
            _image: req.body.image || "example.com/image" // Optional image URL
        });
           // Save the new PR entry to the database
        await newPr.save();

        const newTimeline = new Timeline({
            currentStep:'Created',
            prNo:prNo,
            status:'Done',
            unit:unit,
            remarks:remarks,
            isAdmin:false,
        })
        await newTimeline.save();

        res.status(201).json({
            message: "Purchase Request has been created successfully!",
            data: newPr
        });
      
    } catch (error) {
        console.error("Error while creating PPMP:", error);
        next(errorHandler(500, "Internal Server Error"));
    }
};
export const fetchAllPR = async (req, res, next) => {
    try {
        // Fetch all PPMP entries
        const list = await Pr_monitor.find({});

        if (list.length === 0) {
            return next(errorHandler(204, "No PPMP entries found!"));
        }

        // Count unique units for pr monitor
        const uniqueUnitsCount = await Pr_monitor.distinct("_unit").then(units => units.length);
        // Calculate total ABC (Approved Budget for the Contract)
        const totalABC = list.reduce((sum, item) => sum + (parseFloat(item._abc) || 0), 0);
        

        res.status(200).json({
            count: list.length,
            countUnit: uniqueUnitsCount, // Count all unique units in the database
            totalABC:totalABC,//
            data: list,
        });
    } catch (error) {
        console.error("Error fetching PPMP data:", error);
        next(errorHandler(500, "Something went wrong while fetching data from the database!"));
    }
};
export const fetchByUnitPR = async (req,res,next) => {
    
    try {
        const { unit } = req.params; // Extract the unit from route parameters
        if (!unit) {
            return next(errorHandler(400, "Unit is required"));
        }

        const list = await Pr_monitor.find({ _unit: unit }).sort({ createdAt: -1 });;
        if(!list){
            next(errorHandler(204, "No list of papers yet!"));
        }else{

            // Calculate total estimated budget from all PPMP entries
            const totalBudget = list.reduce((sum, item) => sum + (parseFloat(item._abc) || 0), 0);

            return res.status(200).json({
                count: list.length,
                totalBudget: totalBudget,
                data: list
            });
        }
    } catch (error) {
        console.log(error);
        //Send an error response if something goes wrong
        next(errorHandler(500, "Something went wrong while fetching the data from database!"));
    }
}
export const fetchByIdPR = async (req,res,next) => {

    try {
        const { id } = req.params;
        
        // Check if the ID is a valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return next(errorHandler(400, "ID is not a valid MongoDB _id, Please Check ID"));
        }

        // Try to find the Pr document by ID
        const pr = await Pr_monitor.findById(id);
        
        // If the Pr document is not found, send 404 error
        if (!pr) {
            return next(errorHandler(404, "Pr not found!"));
        }

        // If found, return the PPMP data with a 200 status
        return res.status(200).json(pr);
        
        
    } catch (error) {
        console.log(error);
        //Send an error response if something goes wrong
        next(errorHandler(500, "Something went wrong while fetching the data from database!"));
    }
}
export const updatePR = async (req, res, next) => {
    const {prNumber,
        poNumber,
        title,
        abc,
        fundingSource,
        unit,
        modeOfProcurement,
        dateApprovedPR,
        datePreparedResolution,
        dateResolutionSigned,
        websitePosting,
        dateStartedCanvassing,
        dateFinishedCanvassing,
        datePreparationAbstract,
        dateCompletionAbstract,
        dateSwornAffidavit,
        datePreparedPO,
        dateApprovalPO,
        dateServingPO,
        dateConformedPO,
        postingAward,
        dateDelivered,
        status,
        remarks, fileData
    } = req.body;
    console.log("Current body",req.body)
    
    try {
        // Extracting ID from request parameters
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            next(errorHandler(400, "ID is not a valid MongoDB _id, Please Check ID"));
            return;
        }
        // Validation: check if all required fields are provided
        if (!unit || !prNumber || !title || !abc || !fundingSource || !modeOfProcurement) {
            return next(errorHandler(401, "Something is missing, fill up all required fields!"));
        }
        // Fetch the original document before updating
        const originalPr = await Pr_monitor.findById(id);
        if (!originalPr) {
            return next(errorHandler(404, "PR not found!"));
        }
        // Perform the update using `findByIdAndUpdate`
        const updatedPr = await Pr_monitor.findByIdAndUpdate(
            id,
            {
                _pr_no: prNumber,
                _po_no: poNumber || "N/A",
                _title: title,
                _abc: abc,
                _fund_source: fundingSource,
                _unit: unit,
                _mode: modeOfProcurement,
                _date_approved_pr: dateApprovedPR  || "N/A",
                _date_prepared_resolution: datePreparedResolution || "N/A",
                _date_resolution_signed:        dateResolutionSigned || "N/A",
                _date_posting: websitePosting || "N/A",
                _date_start_canvas: dateStartedCanvassing || "N/A",
                _date_finished_canvas: dateFinishedCanvassing || "N/A",
                _date_prepare_abstract: datePreparationAbstract || "N/A",
                _date_completion_abstract: dateCompletionAbstract || "N/A",
                _remarks: remarks || "N/A",
                _date_sworn_affidavit: dateSwornAffidavit || "N/A",
                _date_prepared_po: datePreparedPO || "N/A",
                _date_approval_po: dateApprovalPO || "N/A",
                _date_serving_po: dateServingPO || "N/A",
                _date_conformed_supplier_po: dateConformedPO || "N/A",
                _date_posting_award: postingAward || "N/A",
                _date_delivered: dateDelivered || "N/A",
                _status: status || "N/A",
                _fileData: fileData, // For binary file storage
            },
            { new: true } // Return the updated document
        );
    
        // If the paper is not found, return a 404 error
        if (!updatedPr) {
            return next(errorHandler(404, "PR not found!"));
        }

        // Compare the original and updated documents to capture changes
        const changes = [];
        for (const key in updatedPr._doc) {
            if (updatedPr._doc[key] !== originalPr._doc[key]) {
                changes.push({
                    field: key,
                    originalValue: originalPr._doc[key],
                    updatedValue: updatedPr._doc[key]
                });
            }
        }

        const newTimeline = new Timeline({
            currentStep:dateApprovedPR ? 'Date Approved Pr':'Date',
            prNo:prNumber,
            status:'Done',
            unit:unit,
            remarks:remarks,
            isAdmin:true,
        })
        await newTimeline.save();

        const newNotification = new Notifcation({
            unit:unit,
            message:'The procurement office updated your pr # '+prNumber,
            additionalInfo:changes,
        })
        await newNotification.save();
        
        // Respond with success message if update is successful

        return res.status(200).json({
            message: "Paper has been updated successfully!",
            changes: changes,//list here all changes
            data: updatedPr
        });

    } catch (error) {
        console.error("Error updating PPMP:", error);
        // Send an error response if something goes wrong
        next(errorHandler(500, "Something went wrong while updating the data from the database!"));
    }
};
export const deletePR = async (req,res) => {
    try {
        // Extract the PR ID from the request parameters
        const { id } = req.params;
        
        // Find the PR document before deleting it
        const prToDelete = await Pr_monitor.findById(id);
        
        // If the PR does not exist, return a 404 error
        if (!prToDelete) {
            return next(errorHandler(404, "PR not found!"));
        }

        // Store the deleted file in the DeletedFiles collection before deletion
        const deletedFile = new DeletedFiles({
            unit: prToDelete._unit,
            type: 'PR',
            documentData: prToDelete,
            deleteTime: new Date(), // Capture the current time of deletion
        });

        // Save the deleted file information to the database
        await deletedFile.save();
        const result = await Pr_monitor.findByIdAndDelete(id);
        // If the deletion was successful, return a success message
        return res.status(200).json({ message: "PR has been deleted successfully!" });
    } catch (error) {
        console.log(error);
        //Send an error response if something goes wrong
        next(errorHandler(500, "Something went wrong while deleting the data from database!"));
    }
}

//Restore Files
export const restoreFile = async (req, res, next) => {
    try {
        const { id } = req.params; // Get the ID of the deleted file from the request parameters
        
        // Find the deleted file in the DeletedFiles collection using the ID
        const deletedFile = await DeletedFiles.findById(id);
        
        // If the file is not found in the DeletedFiles collection
        if (!deletedFile) {
            return next(errorHandler(404, "Deleted file not found!"));
        }

        // Depending on the file type, restore it to the appropriate collection
        let restoredDocument;

        if (deletedFile.type === 'PPMP') {
            // Restore to PPMP collection
            restoredDocument = new PPMP(deletedFile.documentData);
            await restoredDocument.save();
        } else if (deletedFile.type === 'PR') {
            // Restore to Pr_monitor collection
            restoredDocument = new Pr_monitor(deletedFile.documentData);
            await restoredDocument.save();
        } else {
            return next(errorHandler(400, "Unsupported file type for restoration!"));
        }

        // Optionally, delete the restored file from the DeletedFiles collection
        await DeletedFiles.findByIdAndDelete(id);

        // Respond with a success message indicating the restoration was successful
        return res.status(200).json({
            message: "File has been restored successfully!",
            restoredDocument: restoredDocument
        });

    } catch (error) {
        console.log(error);
        // Handle any unexpected errors
        return next(errorHandler(500, "Something went wrong while restoring the file!"));
    }
};



export const fetchTimelinesByPr = async (req,res,next) => {
    
    try {
        const { prNo } = req.params; // Extract the unit from route parameters
        if (!prNo) {
            return next(errorHandler(400, "Unit is required"));
        }

        const list = await Timeline.find({ prNo });
        if(!list){
            next(errorHandler(204, "No list timeline yet!"));
        }else{
            return res.status(200).json({list});
        }
    } catch (error) {
        console.log(error);
        //Send an error response if something goes wrong
        next(errorHandler(500, "Something went wrong while fetching the data from database!"));
    }
}


export const fetchByUnitNotification = async (req, res, next) => {
    try {
        const { unit } = req.params; // Extract the unit from route parameters
        console.log(unit)

        if (!unit) {
            return next(errorHandler(400, "Unit is required"));
        }

        // Find all PPMP entries for the specified unit
        const list = await Notifcation.find({ unit }).sort({ createdAt: -1 });


        return res.status(200).json({list});
    } catch (error) {
        console.error("Error fetching PPMP by unit:", error);
        // Send an error response if something goes wrong
        next(errorHandler(500, "Something went wrong while fetching the data from the database!"));
    }
};

export const updateNotification = async (req, res, next) => {
    try {
        const { id } = req.params; // Extract the unit from route parameters
        console.log(id)

        if (!id) {
            return next(errorHandler(400, "id required"));
        }

        // Find all PPMP entries for the specified unit
        const list =  await Notifcation.findByIdAndUpdate(
            id,
            { $set: { read: true } }, // Update read field to true
            { new: true } // Return the updated document
        );
        return res.status(200).json({list});
    } catch (error) {
        console.error("Error fetching PPMP by unit:", error);
        // Send an error response if something goes wrong
        next(errorHandler(500, "Something went wrong while fetching the data from the database!"));
    }
};
