import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuid library for generating unique IDs
import { DndContext, useDroppable, DragOverlay, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { IoTrashOutline, IoOpenOutline  } from "react-icons/io5";
import useAddTasks from '../hooks/tasks/AddTasks';
import { useDecryptUserData } from '../hooks/user/DecryptUserData';
import {useFetchTask} from '../hooks/tasks/FetchTask';
import { Link } from 'react-router-dom';
// Redux imports
import {setCurrentDetails} from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const columns = ['To Do', 'In Progress', 'Completed', 'Cancelled'];
const initialTasks = JSON.parse(localStorage.getItem('kanbanTasks')) || {
  'To Do': [],
  'In Progress': [],
  'Completed': [],
  'Cancelled': [],
};
const initialDeletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];

function TaskCard({ task, onDelete }) {
    const { setNodeRef, attributes, listeners } = useSortable({ id: task.id, title: task.title, description: task.description});
  
    // Dispatch function to interact with Redux actions
    const dispatch = useDispatch();
    
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className="task-card bg-gray-500 p-4 rounded-md shadow-md mb-2 flex justify-between items-center"
        onClick={(e) => {
            e.stopPropagation();
          }}
      >
        <span>{task.title}</span>
        <div className={`flex gap-3`}>
            {/* Open to tanginamo */}
            <button
            className="ml-2  text-white rounded-full "
            onClick={(e) => {
                console.log(task.id);
                dispatch(setCurrentDetails(task.id));
                e.stopPropagation(); // Prevent drag event propagation
            }}
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag initiation from the button
            >
            <Link to="/task-details"><IoOpenOutline className={`hover:scale-125 `}/></Link>
            </button>

            {/* Delete to tanginamo */}
            <button
            className="ml-2  text-white rounded-full "
            onClick={(e) => {
                e.stopPropagation(); // Prevent drag event propagation
                onDelete(task.id);
            }}
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag initiation from the button
            >
            <IoTrashOutline className={`hover:scale-125 `}/>
            </button>

        </div>
      </div>
    );
  }
  

function KanbanColumn({ columnName, tasks, onDeleteTask }) {
  const { setNodeRef } = useDroppable({ id: columnName });

  return (
    <div ref={setNodeRef} className="kanban-column flex flex-col p-4 bg-gray-300  flex-grow rounded-md shadow-md dark:bg-[#333334] ">
      <h2 className="font-bold text-xl mb-4">{columnName}</h2>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} id={`${columnName}-${task}`} onDelete={onDeleteTask} />
        ))}
      </SortableContext>
    </div>
  );
}

export default function TaskBoard() {

    let {decryptedCurrentuser} = useDecryptUserData();//get tghe current user
    const {taskValues, refetchTasks} = useFetchTask(decryptedCurrentuser);
    
    useEffect(() => {
        if(taskValues){
            console.log("Current Values: ", taskValues)
            setTasks(taskValues);
        }
    }, [taskValues]);

    const [tasks, setTasks] = useState(initialTasks);
    const [newTask, setNewTask] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [activeId, setActiveId] = useState(null);
    const [deletedTasks, setDeletedTasks] = useState(initialDeletedTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);

   
    const addTasks = useAddTasks(decryptedCurrentuser,tasks);//callback function to add new tasks
   
    



    useEffect(() => {
        if(decryptedCurrentuser){
            console.log("Current User: ", decryptedCurrentuser)
            refetchTasks(decryptedCurrentuser);
        }
    }, [decryptedCurrentuser]);


    useEffect(() => {
        localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
        if(tasks && decryptedCurrentuser){
            addTasks(decryptedCurrentuser,tasks)
            console.log("Current Tasks: ",tasks)
        }
    }, [tasks]);


    useEffect(() => {
        localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
        if(deletedTasks.length > 0){
            console.log("Deleted Tasks: ", deletedTasks)
        }
        
        if(tasks && decryptedCurrentuser){
            addTasks(decryptedCurrentuser,tasks)
        }
    }, [deletedTasks]);


    const handleTaskCreate = (columnName) => {
        if (newTask.trim() && !tasks[columnName].includes(newTask)) {
        const newTaskObj = { id: uuidv4(), title: newTask.trim(), description: newDescription.trim() };
        setTasks((prevTasks) => ({
            ...prevTasks,
            [columnName]: [...prevTasks[columnName], newTaskObj],
        }));
        setNewTask('');
        setNewDescription('');
        setIsModalOpen(false);
        }
    };

    const handleTaskDelete = (taskId) => {
        let deletedColumn = null; // To track the column name
        setTasks((prevTasks) => {
            const updatedTasks = {};
            for (const column in prevTasks) {
                const filteredTasks = prevTasks[column].filter((task) => task.id !== taskId);
                if (filteredTasks.length !== prevTasks[column].length) {
                    deletedColumn = column; // Capture the column name
                }
                updatedTasks[column] = filteredTasks;
            }
            return updatedTasks;
        });
    
        const deletedTask = Object.values(tasks)
            .flat()
            .find((task) => task.id === taskId);
        
        if (deletedTask) {
            setDeletedTasks((prevDeleted) => [
                { ...deletedTask, columnName: deletedColumn, status: "Deleted" },
                ...prevDeleted, // Prepend the new task to the existing list
            ]);
        }
    };
    
      

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
      
        const sourceColumn = Object.keys(tasks).find((column) =>
          tasks[column].some((task) => task.id === active.id)
        );
        const destinationColumn = over.id;
      
        if (sourceColumn && destinationColumn && sourceColumn !== destinationColumn) {
          const taskToMove = tasks[sourceColumn].find((task) => task.id === active.id);
      
          setTasks((prevTasks) => {
            const updatedTasks = { ...prevTasks };
      
            updatedTasks[sourceColumn] = updatedTasks[sourceColumn].filter((task) => task.id !== active.id);
            updatedTasks[destinationColumn] = [...updatedTasks[destinationColumn], taskToMove];
            console.log('Active ID:', active.id);
            console.log('Over ID:', over.id);
            console.log('Source Column:', sourceColumn);
            console.log('Destination Column:', destinationColumn);

      
            return updatedTasks;
          });
        }
      };
      
      
  return (
    <div className="w-full h-full relative text-sm">
        <div className={` w-full flex flex-col gap-5 relative p-4 md:p-8`}>
            {/* Section 1 */}
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa]">Task Board</h1>
                <p className="text-sm text-gray-500">Task Lists that lets you create cards of tasks</p>
                </div>
                <button className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium cursor-pointer text-white bg-green-600 hover:bg-green-700 transition-colors
                    `} onClick={() => setIsModalOpen(!isModalOpen)}>Add new Task</button>
            </div>

            {/* Section 3 */}
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        
                <div className="kanban-board flex mt-4 min-h-80 justify-between gap-4">
                {columns.map((column) => (
                    <KanbanColumn
                    key={column}
                    columnName={column}
                    tasks={tasks[column] || []}
                    onDeleteTask={handleTaskDelete}
                    />
                ))}
                </div>
                <DragOverlay>
                {activeId ? (
                    <div className="task-card bg-darkBg4 p-4 rounded-md shadow-md mb-2 text-xs border-2">draggable container</div>
                ) : null}
                </DragOverlay>
            </DndContext>
            {/* Section 4 */}
            <div className="deleted-tasks mt-6">
                <h3 className="font-bold text-lg mb-2">Deleted Tasks:</h3>
                <ul>
                {deletedTasks.map((task, index) => (
                    <li key={task.id || index} className="bg-gray-300 p-2 rounded-md shadow-md mb-2">
                        <span className="font-bold">Status: [{task.status}]</span>
                        <h3>Last Status: {task.columnName}</h3>
                        <h3>Task Title: {task.title}</h3>
                        <h3>
                            Task Description:{" "}
                            {task.description.length > 50
                                ? `${task.description.slice(0, 50)}...`
                                : task.description}
                        </h3>
                    </li>
                ))}


                </ul>
            </div>
        </div>
        {/* Modal */}
        {isModalOpen && (
            <div className="absolute inset-0  bg-opacity-50 flex justify-center items-start z-50">
                <div className="bg-darkBg3 mt-10 p-6 rounded-md shadow-lg w-full max-w-md h-auto dark:bg-[#3B3D3E]">
                    
                    <div className={` flex flex-col gap-5 flex-wrap  h-full`}>
                        <h3 className="text-lg font-bold ">Add Task</h3>
                        <input
                            type="text"
                            className="px-2 h-8 border border-gray-300 bg-darkBg3 rounded-md"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Enter new task Title"
                        />
                            {/* Task Description Input */}
                        <textarea
                            className="p-2 min-h-32 border border-gray-300 bg-darkBg3 rounded-md"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            placeholder="Enter task description"
                        />
                        <div className={`flex justify-end `}>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-[#cc6f6f] px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                className="ml-2 bg-[rgba(87,179,93,1)] text-white p-2 rounded-md cursor-pointer"
                                onClick={() => handleTaskCreate('To Do')}
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}

