import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Redux imports
import {
  signOut
} from '../redux/user/userSlice';

import { Frown} from "lucide-react";
import { IoSunnyOutline, IoNotificationsOutline, IoPersonOutline, IoPersonCircleOutline , IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { useDecryptUserData } from '../hooks/user/DecryptUserData';
import { useGetPageHeading } from '../hooks/GetPageHeading';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchNotification } from '../hooks/FetchNotification';
import useUpdateNotification from '../hooks/UpdateNotification';

// Header button links configuration
const btnLinks = [
  { icon: <IoSunnyOutline />, label: 'Theme' },
  { icon: <IoNotificationsOutline />, label: 'Notification' },
  { icon: <IoPersonOutline />, label: 'Account' },
];

// Header button component
const HeaderButtons = ({ notificationCount, handleModalAccount, toggleDarkMode, isModalOpen, handleLogoutClick, accountRef, handleModalNotif}) => (
  btnLinks.map(({ icon, label }, index) => (
    <div key={index} className={`flex flex-col items-center relative `} 
      onClick={label === 'Theme' ? (toggleDarkMode) : label === 'Account' ? (handleModalAccount) : (handleModalNotif)}>
        {/* Notification badge positioned above the icon container */}
        {label === 'Notification' && notificationCount > 0 && (
            <div tabIndex="-1" className={`absolute focusa  -top-2 right-0 z-30 text-red-400 bg-white border-[1px] dark:bg-[#46484B] font-semibold  rounded-full text-xs h-5 w-5 flex items-center justify-center`}>
                {notificationCount || 0}
            </div>
        )}
        {/* Icon container */}
        <div className={`size-10 rounded-full flex justify-center items-center 
          bg-gray-300 hover:bg-slate-300 dark:bg-[#333334] dark:hover:bg-[#3B3D3E]
          cursor-pointer hover:text-opacity-80 hover:scale-110`}>
            {icon}
        </div>

        {/* Modal for account options */}
       {label === 'Account' && isModalOpen && 
          <div className={`absolute right-0 top-20 border-x-[1px] border-b-2 bg-gray-300 border-gray-300 h-auto w-auto shadow-lg rounded-b-md`}>
            <ul ref={accountRef}  className={`flex flex-col py-10 gap-2 text-gray-800 px-4`}>
              {/* Account settings options */}
              <li className={`hover:bg-darkBg4 w-full py-2 px-14 cursor-pointer flex gap-4 justify-start items-center`}>
                <IoPersonCircleOutline /> Account
              </li>
              <li className={`hover:bg-darkBg4 w-full py-2 px-14 cursor-pointer flex gap-4 justify-start items-center`}>
                <IoSettingsOutline /> Settings
              </li>
              <hr />
              {/* Logout option */}
              <li className={`hover:bg-darkBg4 w-full py-2 px-14 cursor-pointer flex gap-4 justify-start items-center`} onClick={handleLogoutClick}>
                <IoLogOutOutline /> Log-out
              </li>
            </ul>
          </div>
        }
    </div>
  ))
);

export default function Header({ isModalOpens }) {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  // State variables to handle notification count and modal visibility
  const [notificationCount,setNotificationCount] = useState(null); // Replace with dynamic count if needed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false); // State for logout confirmation modal
  const [notifModal, setNotifModal] = useState(false);
  const {decryptedIsUserAdmin}=useDecryptUserData();

  const {notifications, refetchNotification}= useFetchNotification();
  const [notifs, setNotifs] = useState({});
  const [archive, setArchive] = useState(false);

  useEffect(() =>{

    if(notifications && notifications.length > 0){
      setNotifs(notifications);
      setNotificationCount(notifications.length)
    }
  },[notifications, refetchNotification])

  const {updateNotification} = useUpdateNotification();

  const handleUpdateNotif = async (id)=>{
    const res = await updateNotification(id);
  }



  // Dispatch function to interact with Redux actions
  const dispatch = useDispatch();
  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newIsDark = !prev;
      document.documentElement.classList.toggle('dark', newIsDark);
      localStorage.setItem('isDarkMode', newIsDark); // Persist the state
      return newIsDark;
    });
  };
  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('isDarkMode') === 'true';
    setIsDark(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleModalNotif = () => { setNotifModal(!notifModal); };
  const handleModalAccount = () => { setIsModalOpen(!isModalOpen); };
  const handleLogoutClick = () => {setIsConfirmLogoutOpen(true);} //  };
  const handleCancelLogout = () => { setIsConfirmLogoutOpen(false); setIsModalOpen(false); };

  const { activePage } = useGetPageHeading(); // Get the current page heading and display it

  const handleConfirmLogout = () =>{
    dispatch(signOut());  
    navigate('/'); // Redirect to the dashboard after successful sign-in
  }

   const accountRef = useRef(null);
    // Close modal if clicked outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (accountRef.current && !accountRef.current.contains(event.target)) {
          setIsModalOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [accountRef]);




  return (
    <div className={` h-full w-full flex justify-between items-center px-5`}>
      <div className={``}>
        {activePage}
      </div>
      <div className={`flex items-center gap-5 `}>
        <HeaderButtons 
          handleLogoutClick={handleLogoutClick}
          isModalOpen={isModalOpen} 
          notificationCount={notificationCount} 
          toggleDarkMode={toggleDarkMode} 
          handleModalAccount={handleModalAccount}
          accountRef={accountRef}
          handleModalNotif={handleModalNotif}
          />
      </div>


       
      <div className={`z-50 fixed right-2 lg:top-24 top-40 h-full lg:w-64 w-1/2 bg-white dark:bg-[#252728] transition-transform duration-300 delay-150 p-2 flex flex-col gap-2 overflow-y-auto
        ${notifModal ? 'translate-0 ':'opacity-0 translate-x-96'}`}>
          <span>Notifications</span>
        {notifs && notifs.length > 0 ? (
          notifs.map((notif, index) => (
            <div 
              key={notif._id} 
              draggable
              onDragEnd={handleUpdateNotif}
              className="w-full border grid p-4 bg-white rounded-lg shadow relative">
              
              
              <div className={`w-full flex gap-2`}>
                <input 
                  type="checkbox" 
                  onClick={() => handleUpdateNotif(notif._id)} // Checkbox event
                  className='' />
                <span className={`text-xs text-blue-400`}>unread</span>
              </div>
              
              <p className="font-semibold text-sm text-gray-700">{notif.message}</p>
              
              <ul className="mt-2 text-xs text-gray-600">
                {notif.additionalInfo
                  .filter(info => 
                    info.field !== '_id' && 
                    info.field !== 'createdAt' && 
                    info.field !== 'updatedAt' && 
                    info.field !== '_fileData' && 
                    info.field !== '_image') // Filter out unwanted fields
                  .map((info, idx) => (
                    <li key={idx} className="mb-1">
                      <strong>{info.field}: </strong>
                      <div className={`flex flex-col`}>
                        <span>Original Value: {info.originalValue}</span>
                        <span>Updated Value: {info.updatedValue}</span>
                      </div>
                    </li>
                  ))}
              </ul>
              
              <p className="text-xs text-gray-400 mt-2">Updated at: {new Date(notif.updatedAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <div className={`flex flex-col gap-2 h-full w-full justify-center items-center text-red-300`}>No Notifications Yet! <Frown /></div>
        )}
      </div>

      


       

        {/* Log-out confirmation modal */}
        {isConfirmLogoutOpen && (
          <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50`}>
            <div className={`bg-darkBg1 border-[1px] border-slate-400 w-80 h-40 rounded-md p-6 flex flex-col items-center justify-center gap-5`}>
              <div className={`text-darkText1 text-center`}>
                <p>Are you sure you want to log out?</p>
              </div>
              <div className={`flex justify-between gap-4`}>
                {/* Yes button */}
                <button
                    className={`bg-red-500 text-white px-6 py-2 rounded-md`}
                    onClick={handleConfirmLogout}
                >
                    Yes, Log out
                </button>
                {/* Cancel button */}
                <button
                    className={`bg-gray-500 text-white px-6 py-2 rounded-md`}
                    onClick={handleCancelLogout}
                >
                    Cancel
                </button>
              </div>
            </div>
          </div>
        )}

    </div>
  );
}

