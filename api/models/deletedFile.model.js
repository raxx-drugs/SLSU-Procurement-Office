import { mongoose } from "mongoose";

// Define the schema for deleted files
const deletedFileSchema = mongoose.Schema(
    {
        unit: { type: String, required: true },
        type: { type: String, enum: ['PR', 'PPMP'], required: true }, // Ensures only PR or PPMP types are stored
        deleteTime: { type: Date, default: Date.now }, // The time when the file was deleted
        documentData: { type: mongoose.Schema.Types.Mixed }, // This field will store the entire document
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Create the model based on the schema
const DeletedFiles = mongoose.model('Deleted Files', deletedFileSchema);

export default DeletedFiles;
