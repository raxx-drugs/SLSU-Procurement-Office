
import { useDecryptUserData } from '../user/DecryptUserData'; // Import the decryption hook
import axios from 'axios'; // Import axios for making HTTP requests

function useCreateActivityLog() {
  const { decryptedCurrentuser } = useDecryptUserData(); // Get current user info
  

    const createActivityLog = async ({createActLog}) => {
        try {
          console.log(createActLog);
          if(!createActLog){
            return;
          }
          
          const response = await axios.post('/api/activity/', {
            unit: createActLog.unit,
            action: createActLog.action,
            target: createActLog.type,
            target_type: createActLog.target_type,
            icon: createActLog.icon,
            description: createActLog.description,
          });
          if (response?.data) {
            console.log("Activity Log created successfully:", response.data);
            return response.data; // You can return the response data for further use
          } else {
            console.error("Failed to create activity log.");
            return null;
          }
        } catch (error) {
          console.error(error);
        }
      };

    return  createActivityLog ;
}

export default useCreateActivityLog;
