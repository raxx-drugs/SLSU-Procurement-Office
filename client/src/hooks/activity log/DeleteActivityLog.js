import { useState } from 'react';
import { useDecryptUserData } from '../user/DecryptUserData'; // Import the decryption hook
import axios from 'axios';

export function useDeleteActivityLog() {
    const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData(); // Invoke the hook properly
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteActivityLog = async (activityLogId) => {
        if (!decryptedIsUserAdmin) {
            alert("You don't have the permission to delete activity logs!");
            return;
        }
        try {
            if (window.confirm("Do you want to delete this log?")) {
                setLoading(true);  // Start loading

                const response = await axios.delete(`/api/activity/${activityLogId}`);

                if (response?.data) {
                    alert("Activity Log Deleted Successfully!"); // Alert on success
                }
            }
        } catch (error) {
            setError(error.message);  // Set error message on failure
            console.error("Error deleting activity log:", error);
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    return { deleteActivityLog, loading, error };
}


// Example Usage for Front end:
// import React from 'react';
// import useDeleteActivityLog from '../hooks/useDeleteActivityLog';

// const ActivityLogItem = ({ activityLogId }) => {
//     const { deleteActivityLog, loading, error } = useDeleteActivityLog();

//     return (
//         <div>
//             <button onClick={() => deleteActivityLog(activityLogId)} disabled={loading}>
//                 {loading ? 'Deleting...' : 'Delete Activity Log'}
//             </button>

//             {error && <p>Error: {error}</p>}
//         </div>
//     );
// };