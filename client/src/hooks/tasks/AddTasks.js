import { useCallback } from 'react';
import axios from 'axios';
import { useDecryptUserData } from '../user/DecryptUserData';

function useAddTasks() {
  axios.defaults.withCredentials = true;
  const { decryptedCurrentuser } = useDecryptUserData();

  const addTasks = useCallback(async (tasks) => {
    try {
      if (!tasks || Object.keys(tasks).length === 0) {
        console.warn('No tasks to send');
        return;
      }

      const tasksArray = [
        {
          category: "To_Do",
          tasks: tasks["To Do"]?.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description
          })) || [],
        },
        {
          category: "In_Progress",
          tasks: tasks["In Progress"]?.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description
          })) || [],
        },
        {
          category: "Completed",
          tasks: tasks["Completed"]?.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description
          })) || [],
        },
        {
          category: "Cancelled",
          tasks: tasks["Cancelled"]?.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description
          })) || [],
        }
      ];

      const response = await axios.post('/api/task/', {
        unit: decryptedCurrentuser,
        tasks: tasksArray
      });

      console.log('Tasks synced successfully:', response.data);
      
    } catch (error) {
      console.error("Error while syncing tasks:", error);
    }
  }, [decryptedCurrentuser]);

  return addTasks;
}

export default useAddTasks;


// example usage in front end to send data in this hook:
// const TaskForm = () => {
//     const [tasks, setTasks] = useState({
//       "To Do": [
//         { id: "102", title: "Task 3", description: "Third task" },
//         { id: "103", title: "Task 4", description: "Fourth task" },
//       ],
//       "In Progress": [
//         { id: "104", title: "Task 5", description: "Fifth task" },
//       ],
//       "Completed": [],
//       "Cancelled": [],
//     });
  
//     const addTasks = useAddTasks();
  
//     const handleAddTasks = () => {
//       addTasks(tasks);
//     };



// Right syntax when addding to the database:
// {
//     "unit": "CIT",
//     "tasks": [
//       {
//         "category": "To_Do",
//         "tasks": [
//           { "id": "102", "title": "Task 3", "description": "Third task" },
//           { "id": "103", "title": "Task 4", "description": "Fourth task" },
//           { "id": "108", "title": "Task 8", "description": "8th task" }
//         ]
//       },
//       {
//         "category": "In_Progress",
//         "tasks": [
//           { "id": "110", "title": "Task 10", "description": "10th task" }
//         ]
//       },
//       {
//         "category": "Completed",
//         "tasks": []
//       },
//       {
//         "category": "Cancelled",
//         "tasks": []
//       }
//     ]
//   }