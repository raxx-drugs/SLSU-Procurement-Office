import { useDecryptUserData } from '../user/DecryptUserData'; // Import the decryption hook
import axios from 'axios'; // Import axios for making HTTP requests

function useDeletePPMP() {
    const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData(); // Get decrypted user data
    const deletePPMP = async (ppmpId)=>{
        try {
            // If ppmpId is an array, handle deletion of all IDs
            if (Array.isArray(ppmpId) && ppmpId.length > 1) {
                const confirmDelete = window.confirm(`Are you sure you want to delete ${ppmpId.length} projects?`);
                if (confirmDelete) {
                    // Loop through all IDs and delete each one
                    for (const id of ppmpId) {
                        await axios.delete(`/api/paper/ppmp/${id}`);
                    }
                    alert("Projects Deleted Successfully!");
                } else {
                    return;
                }
            } else {
                // If it's a single ID, delete it
                const confirmDelete = window.confirm("Do you want to delete this project?");
                if (confirmDelete) {
                    const response = await axios.delete(`/api/paper/ppmp/${ppmpId}`);
                    if (response.data) {
                        alert("Project Deleted Successfully!");
                    }
                } else {
                    return;
                }
            }
        } catch (error) {
           
            console.log(error);  // Optionally log the error for debugging
        } 
    }
    return ( deletePPMP );
}

export default useDeletePPMP;

