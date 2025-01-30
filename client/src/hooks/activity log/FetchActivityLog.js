import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDecryptUserData } from '../user/DecryptUserData';

// Utility function to format the date
function formatDateToTimeString(date) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true 
  };
  return new Date(date).toLocaleString('en-US', options);
}

export function useFetchActivityLog() {
  const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData();
  const [activityLogList, setActivityLogList] = useState([]);

  useEffect(() => {
    if(decryptedData){
      console.log(decryptedData)
    }
  },[decryptedData])

  const fetchActivityLog = useCallback(async () => {
    
    try {
      let url;
      if(decryptedData){

        if (decryptedIsUserAdmin) {
          url = `/api/activity/`; // Admin endpoint
        } else {
          const userUnit = decryptedCurrentuser;  // Extract userUnit from decrypted current user
          url = `/api/activity/unit/${userUnit}`; // User-specific endpoint
        }
  
        console.log(`/api/activity/unit/${decryptedCurrentuser}`);
        const response = await axios.get(url);
        console.log(response)

        // Access response.data.data array
        const logs = response.data.data;
        Array.isArray(logs)
        if (Array.isArray(logs)) {
          const transformedLogs = logs.map((log, index) => ({
            id: log._id, // Assuming you need sequential IDs; alternatively, you can use log._id if available
            avatar: "https://v0.dev/placeholder-user.jpg", // Placeholder for user image, replace with actual logic if needed
            name: log.unit, // unit from the log
            action: log.action, // action from the log
            target: log.target, // target from the log
            targetType: log.target_type, // target_type from the log
            time: formatDateToTimeString(log.createdAt), // Formatted time string
            date: new Date(log.createdAt), // Date object for further processing
            icon: log.icon, // icon field from the log
            description: log.description, // description from the log
          }));

          setActivityLogList(transformedLogs);
          //console.log(transformedLogs); // Log the transformed data for debugging
        }
      }
    } catch (error) {
      if(error.status === 404){
        return;
      }
      console.error("Error fetching activity log:", error.message);
    }
  }, [decryptedData, decryptedIsUserAdmin, decryptedCurrentuser]);

  // Initial fetch when the component mounts
  useEffect(() => {
    fetchActivityLog();
  }, [fetchActivityLog]);

  return { activityLogList, refetchActivityLog: fetchActivityLog };
}


//
// Example Usage in the fornt end
// import React, { useEffect } from 'react';
// import { useFetchActivityLog } from '../hooks/useFetchActivityLog';

// const ActivityLogList = () => {
//   const { activityLogList, refetchActivityLog } = useFetchActivityLog();

//   useEffect(() => {
//     // Optionally trigger a refetch manually (e.g., via a button)
//     refetchActivityLog();
//   }, [refetchActivityLog]);

//   return (
//     <div>
//       <h2>Activity Logs</h2>
//       {activityLogList.length > 0 ? (
//         <ul>
//           {activityLogList.map((log, index) => (
//             <li key={index}>{log.description}</li> // Display log descriptions or other relevant data
//           ))}
//         </ul>
//       ) : (
//         <p>No activity logs available.</p>
//       )}
//     </div>
//   );
// };

// export default ActivityLogList;
