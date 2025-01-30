import { useCallback } from 'react';
import axios from 'axios';
import { useDecryptUserData } from '../user/DecryptUserData';

function useUpdateTask() {
  // Set axios to include credentials (for cookies, sessions, etc.)
  axios.defaults.withCredentials = true;

  // Invoke the decryption hook
  const { decryptedCurrentuser } = useDecryptUserData();

  const updateTask = useCallback(async (taskId, newCategory, newIndex) => {
    try {
      if (!taskId || !newCategory || newIndex === undefined) {
        console.warn('Invalid parameters to move task');
        return;
      }
      console.log("Update starts here: ", taskId,newCategory,  newIndex)

      // Make the PUT API call using Axios to move the task
      const response = await axios.put('/api/task/move', {
        unit: decryptedCurrentuser,
        taskId: taskId,
        newCategory: newCategory,
        newIndex: newIndex,
      });

      console.log('Task moved successfully:', response.data);
      
    } catch (error) {
      console.error("Error while moving task:", error);
    }
  }, [decryptedCurrentuser]);

  return updateTask;
}

export default useUpdateTask;
