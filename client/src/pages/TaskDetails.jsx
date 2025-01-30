import { useSelector } from 'react-redux';
import { useDecryptUserData } from '../hooks/user/DecryptUserData';
import {useFetchTask} from '../hooks/tasks/FetchTask';
import { useEffect, useState } from 'react';




function TaskCard({ title, description, dateAdded, status, onClick  }) {
  return (
    <div className={` w-full h-32 bg-darkBg4 flex p-4 cursor-pointer`} onClick={onClick}>
      <div className={`md:basis-3/4 w-full flex flex-col`}>
        <div className={`w-full h-10 text-lg font-semibold`}>{title}</div>
        <div className={`w-full h-10 `}>Status: {status}</div>
        <div className={`w-full h-10 `}>Description: {description}</div>
        <div className={`w-full h-10  `}>Date Added: {dateAdded}</div>
      </div>
      <div className={`basis-1/4 rounded-lg bg-slate-500 xxs:hidden md:block`}> </div>
    </div>
  );
}


export default function TaskDetails() {
  let { decryptedCurrentuser } = useDecryptUserData(); // get the current user
  const { taskValues, refetchTasks } = useFetchTask(decryptedCurrentuser);
  const { currentTaskDetails } = useSelector((state) => state.user);
  const [taskLength, setTaskLength]= useState(0);
  const [showTitle, setShowTitle]= useState(null);

  useEffect(() => {
          if(decryptedCurrentuser){
              console.log("Current User: ", decryptedCurrentuser)
              refetchTasks(decryptedCurrentuser);
          }
      }, [decryptedCurrentuser]);


  useEffect(() => {
    if(taskValues){
        console.log("Current Values: ", taskValues)
        // Calculate total number of tasks across all categories
        const totalTasks = Object.keys(taskValues).reduce((total, key) => total + taskValues[key].length, 0);
        setTaskLength(totalTasks);

    }
  }, [taskValues]);


  // Handle task categories safely
  const tasks = taskValues || {};
  return (
    <div className='w-full h-full bg-darkBg text-darkText2 text-sm '>
      {/* Background */}
      <div className="bg-darkBg2 fixed w-full h-28 z-10 "></div>

      <div className={` h-full w-full flex flex-col gap-5 relative z-10 px-5`}>
        {/* Section 1 */}
        <h1 className="pt-2 text-2xl font-semibold mr-5">Task Details</h1>
        {/* Section 2 */}
        <div className={`w-full h-full flex gap-4 xxs:flex-col md:flex-row`}>
          {/* Section 2 - column 1*/}
          <div className={` xxs:basis-1/3 md:basis-1/2 h-full p-4 flex flex-col gap-1 flex-grow xxs:order-2 md:order-1 overflow-y-auto pb-40`}>
          <h1>Total tasks: {taskLength}</h1>
   
            {tasks["To Do"]?.map((task, index) => (
              <TaskCard
                key={index}
                title={task.title}
                description={task.description}
                dateAdded="1-2-2025" // Placeholder for dynamic date
                status="To Do"
                onClick={() => setShowTitle(task.title)} // Update the showTitle state on click
              />
            ))}
            {tasks["In Progress"]?.map((task, index) => (
              <TaskCard
                key={index}
                title={task.title}
                description={task.description}
                dateAdded="1-2-2025" // Placeholder for dynamic date
                status="In Progress"
                onClick={() => setShowTitle(task.title)} // Update the showTitle state on click
              />
            ))}
            {tasks["Completed"]?.map((task, index) => (
              <TaskCard
                key={index}
                title={task.title}
                description={task.description}
                dateAdded="1-2-2025" // Placeholder for dynamic date
                status="Completed"
                onClick={() => setShowTitle(task.title)} // Update the showTitle state on click
              />
            ))}
            {tasks["Cancelled"]?.map((task, index) => (
              <TaskCard
                key={index}
                title={task.title}
                description={task.description}
                dateAdded="1-2-2025" // Placeholder for dynamic date
                status="Cancelled"
                onClick={() => setShowTitle(task.title)} // Update the showTitle state on click
              />
            ))}
  

          </div>

          {/* Section 2 - column 2 */}
          {currentTaskDetails && (
            <div className={`xxs:basis-2/3 md:basis-1/2 xxs:order-1 md:order-2 flex`}>
              <div className={`w-full h-full min-h-96 max-h-[500px] bg-darkBg4 rounded-lg`}>
                {showTitle}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
