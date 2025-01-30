import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDecryptUserData } from '../user/DecryptUserData';

export function useFetchTask(initialTasks = []) {
  const { decryptedCurrentuser } = useDecryptUserData();

  const [taskValues, setTaskValues] = useState(initialTasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tasks function
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!decryptedCurrentuser) {
        console.warn("User data is not available.");
        return;
      }

      const response = await axios.get(`/api/task/${decryptedCurrentuser}`);
      if (!response || !response.data || response.data.count === 0) {
        console.warn("No response or tasks data from the server.");
        return;
      }

      const initialValue = response.data.data[0]; // Assuming there's only one entry in the array

      // Transform the data to the desired format (handling empty or undefined data)
      const transformedTasks = {
        "To Do": initialValue?.to_do || [],
        "In Progress": initialValue?.in_progress || [],
        "Completed": initialValue?.completed || [],
        "Cancelled": initialValue?.cancelled || [],
      };

      setTaskValues(transformedTasks);
      console.log("Current Tasks: ",transformedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [decryptedCurrentuser]);

  // Fetch tasks when the hook is initialized
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { taskValues, refetchTasks: fetchTasks, loading, error };
}

// Example task values after populating and extracting from the response;
// {
//   "To Do": [
//     { "id": "102", "title": "Task 3", "description": "Third task" },
//     { "id": "103", "title": "Task 4", "description": "Fourth task" },
//     { "id": "108", "title": "Task 8", "description": "8th task" },
//     { "id": "m63pxn40qq3bx8c6f", "title": "Aaa", "description": "aaa" }
//   ],
//   "In Progress": [
//     { "id": "110", "title": "Task 10", "description": "10th task" },
//     { "id": "m63pxn40qq3bx8c6f", "title": "Aaa", "description": "aaa" }
//   ],
//   "Completed": [],
//   "Cancelled": []
// }

