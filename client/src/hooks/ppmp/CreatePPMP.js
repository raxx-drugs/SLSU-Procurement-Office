
import { useDecryptUserData } from '../user/DecryptUserData'; // Import the decryption hook
import axios from 'axios'; // Import axios for making HTTP requests

// Assuming formatDate is imported or defined somewhere in the scope
import { formatDate } from '../../utils/formatDate'; // Example import (adjust path accordingly)

// Expected formData structure
// {
//   "type": "PPMP",
//   "unit": "CIT",
//   "title": "Project 1",
//   "fundingSource":"Pre STF",
//   "ppmpData": {
//       "description":["Transcript of Records", "Desktop Computers"],
//       "qnty": ["9200 pcs", "2 sets"],
//       "mode": ["Transfer of Fund/Bao", "Direct Contracting"],
//       "estimatedBudget": [20000,10000],
//       "dateStart": ["01-01-2025", "02-15-2025"],
//       "dateEnd": ["01-01-2025", "03-15-2025"]
//   },
//   "status": "Pending",
//   "totalEstimatedBudget": "300000",
//   "remarks": "Potangina description to",
//   "fileData": "https://example.com/file"
// }

function useCreatePPMP() {
    const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData(); // Invoke the hook properly

    const createPPMP = async ({formData}) => {
        try {
          // Format date arrays if they exist
          const formattedStartDates = formData.dateStart.map(date => formatDate(date));
          const formattedEndDates = formData.dateEnd.map(date => formatDate(date));


          // Build the payload to match the backend structure
          const payload = {
            type: "PPMP",
            unit: formData.unit || decryptedCurrentuser, // Default to the current user unit if not provided
            title: formData.title || "Project 1", // Example title, adjust as necessary
            fundingSource: formData.fundingSource || "Pre STF", // Default funding source if not provided
            ppmpData: {
                description: formData.description || [],
                qnty: formData.qnty || [],
                mode: formData.mode || [],
                estimatedBudget: formData.estimatedBudget || [],
                dateStart: formattedStartDates || [],
                dateEnd: formattedEndDates || [],
                prUsed: formData.prUsed || [],
            },
            status: formData.status || "Pending", // Default status if not provided
            totalEstimatedBudget: formData.totalEstimatedBudget || 0, // Default budget
            remarks: formData.remarks || "No remarks provided",
            file: formData.fileData || "https://example.com/file", // Default file data if not provided
        };
        console.log("current formdata:",payload)
          
          // Send the request to the backend
          const response = await axios.post('/api/paper/ppmp', payload ,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }});

          if (!response) {
              alert("Something went wrong!");
              return;
          }
          alert("Successfully Uploaded to database!");     
        
        } catch (error) {
          console.error(error);
        }
      };

    return  createPPMP ;
}

export default useCreatePPMP;


// Example usage in the frontend
// const formData = {
//   unit: "CIT",
//   title: "Project 1",
//   fundingSource: "Pre STF",
//   description: ["Transcript of Records", "Desktop Computers"],
//   qnty: ["9200 pcs", "2 sets"],
//   mode: ["Transfer of Fund/Bao", "Direct Contracting"],
//   estimatedBudget: [20000, 10000],
//   dateStart: ["01-01-2025", "02-15-2025"],
//   dateEnd: ["01-01-2025", "03-15-2025"],
//   status: "Pending",
//   totalEstimatedBudget: 300000,
//   remarks: "Initial draft",
//   fileData: "https://example.com/file",
// };

// const createPaper = useCreatePPMP();
// createPaper({ formData });