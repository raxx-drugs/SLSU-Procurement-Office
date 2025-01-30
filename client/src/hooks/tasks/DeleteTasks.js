import { useState } from 'react';
import { useDecryptUserData } from '../user/DecryptUserData'; // Import the decryption hook
import axios from 'axios';

export function useDeleteTask() {
    const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData(); // Invoke the hook properly
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteTask = async (taskId) => {

        try {
            if (window.confirm("Do you want to delete this task?")) {
                setLoading(true);  // Start loading

                const response = await axios.delete(`/api/task/${taskId}`);

                if (response?.data) {
                    alert("Task Deleted Successfully!"); // Alert on success
                }
            }
        } catch (error) {
            setError(error.message);  // Set error message on failure
            console.error("Error deleting activity task:", error);
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    return { deleteTask, loading, error };
}