import { useDecryptUserData } from '../user/DecryptUserData'; // Import the decryption hook
import axios from 'axios'; // Import axios for making HTTP requests

function useDeletePr() {
    const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData(); // Get decrypted user data
    const deletePr = async (prIds) => {
        // Check if prIds is an array and not empty
        if (Array.isArray(prIds) && prIds.length > 0) {
            try {
                if (confirm("Do you want to delete these projects?") == true) {
                    // Loop through each prId in the array
                    for (const prId of prIds) {
                        console.log(`Deleting project with ID: ${prId}`);
                        
                        try {
                            const response = await axios.delete(`/api/paper/pr/${prId}`);
                            if (response.data) {
                                // Log the deletion success for debugging purposes
                                console.log(`Successfully deleted project with ID: ${prId}`);
                            }
                        } catch (error) {
                            console.log(`Error deleting project with ID ${prId}:`, error);
                        }
                    }
                } else {
                    
                }
            } catch (error) {
                console.log("Error while deleting projects:", error); // Optionally log the error for debugging
            }
        } else {
            console.log("No project IDs provided for deletion.");
        }
    };

    return deletePr;
}

export default useDeletePr;

