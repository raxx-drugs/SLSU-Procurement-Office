
import { useDecryptUserData } from '../user/DecryptUserData'; // Import the decryption hook
import axios from 'axios'; // Import axios for making HTTP requests

// Assuming formatDate is imported or defined somewhere in the scope
import { formatDate } from '../../utils/formatDate'; // Example import (adjust path accordingly)


function useCreatePR() {
    const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData(); // Invoke the hook properly

    const createPr = async ({prFormData,selectedItem}) => {
        try {
          console.log(prFormData)
                // Build the payload dynamically
            const payload = {
                selectedItem:selectedItem || null,
                unit: prFormData.unit || decryptedCurrentuser,
                type:"Purchase Request",
                title: prFormData.title || "",
                fund_cluster: prFormData.fundingSource || "Unknown Fund",
                status: prFormData.status || "Pending",
                prNo: prFormData.prNumber || "",
                abc: prFormData.abc || 0,
                mode: prFormData.mode || "Unknown Mode",
                date_approved_pr: formatDate(prFormData.dateApprovedPR) || "",
                remarks: prFormData.remarks || "",
                file: prFormData.fileData,// Include file data if available
            };

            console.log("Payload to send:", payload);
          
          // Send the request to the backend
          const response = await axios.post('/api/paper/pr', payload,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }});

          if (!response) {
              alert("Something went wrong!");
              return;
          }
          alert("Successfully Uploaded to database!");     
        
        } catch (error) {
          if(error.status === 401){
            alert("You need PPMP before processing PR!")
              return 1;
          }
          console.error(error);
        }
      };

    return  createPr ;
}

export default useCreatePR;
