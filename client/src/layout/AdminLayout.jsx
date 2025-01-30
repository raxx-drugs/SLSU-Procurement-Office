import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import FileCollection from '../pages/FileCollection';
import PrMonitor from '../pages/PrMonitor';
import AccountsDashboard from '../pages/AccountsDashboard';
import TaskBoard from '../pages/TaskBoard';
import TaskDetails from '../pages/TaskDetails';
import Activity from '../pages/Activity';
import DisplayDetails from '../components/paper/DisplayDetails';
import DisplayPrDetails from '../components/paper/DisplayPrDetails';
import AddUser from '../components/manage user/AddUser';
import AddEntry from '../pages/AddEntry';
import { useDecryptUserData } from '../hooks/user/DecryptUserData';
import Account from '../pages/Account';

export default function AdminLayout() {
  const {decryptedIsUserAdmin}=useDecryptUserData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleSidebarToggle = () => {
      setIsSidebarOpen(!isSidebarOpen)
  }
  return (
    <div className={`min-h-screen w-full`}>
        <div className={`
          grid bg-[#fafafa] dark:bg-[#1C1C1D] dark:text-[#fafafa] 
          grid-rows-[auto_1fr] 
          lg:grid-cols-[auto_1fr]`}>
          {/* Sidebar */}
          <div className={`grid z-50 xxs:block lg:hidden w-full lg:h-screen transition-[height] duration-300 delay-150
            ${isSidebarOpen ? 'h-80 lg:w-64':'h-20 lg:w-20'}`}>
            <div className={`bg-[#fafafa] dark:bg-[#1C1C1D] drop-shadow-lg  fixed w-full lg:h-screen transition-[height] duration-300 delay-150 ${isSidebarOpen ? 'h-80 lg:w-64':'h-20 lg:w-20'}
              `}>
                <Sidebar decryptedIsUserAdmin={decryptedIsUserAdmin} isSidebarOpen={isSidebarOpen} handleSidebarToggle={handleSidebarToggle}/>
            </div>
          </div>
          {/* Sidebar */}
          <div className={`grid z-50 xxs:hidden lg:block w-full lg:h-screen transition-[width] duration-300 delay-150
            ${isSidebarOpen ? 'h-80 lg:w-64':'h-20 lg:w-20'}`}>
            <div className={`bg-gray-100 dark:bg-[#1C1C1D] drop-shadow-lg  fixed w-full lg:h-screen transition-[width] duration-300 delay-150 ${isSidebarOpen ? 'h-80 lg:w-64':'h-20 lg:w-20'}
              `}>
                <Sidebar decryptedIsUserAdmin={decryptedIsUserAdmin} isSidebarOpen={isSidebarOpen} handleSidebarToggle={handleSidebarToggle}/>
            </div>
          </div>
          {/* Header - Main - Footer */}
          <div className={`grid z-20 min-h-screen grid-rows-[auto_1fr_auto] `}>
            <div className={`bg-gray-100 z-20 dark:bg-[#1F1F1F] grid h-24 w-full sticky top-0 shadow-sm `}>
                <Header/> 
            </div>
            {/* Main */}
            <div className={`w-full h-full z-10 overflow-hidden pb-4`}>
                <div className={`w-full h-full p-2 bg-gradient-to-b from-blue-50 to-white dark:from-[#1F1F1F] dark:to-[#5f6163]`}>
                  <div className="w-full h-full shadow-2xl p-2 flex">
                    <div className="w-full h-full bg-white dark:bg-[#252728] rounded-xl overflow-hidden shadow-sm p-2">
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard decryptedIsUserAdmin={decryptedIsUserAdmin}/>} />

                          <Route path="/file-collection" element={<FileCollection decryptedIsUserAdmin={decryptedIsUserAdmin}/>} />
                          <Route path="/file-collection/details" element={<DisplayDetails/>} />

                          <Route path="/pr-monitor" element={<PrMonitor decryptedIsUserAdmin={decryptedIsUserAdmin}/>} />
                          <Route path="/pr-monitor/details" element={<DisplayPrDetails/>} />

                          <Route path="/add-entry" element={<AddEntry/>} />

                          <Route path="/manage-user" element={<AccountsDashboard decryptedIsUserAdmin={decryptedIsUserAdmin}/>} />
                          <Route path="/add-user" element={<AddUser/>} />

                          <Route path="/task-board" element={<TaskBoard decryptedIsUserAdmin={decryptedIsUserAdmin}/>} />
                          <Route path="/task-details" element={<TaskDetails decryptedIsUserAdmin={decryptedIsUserAdmin}/>} />

                          <Route path="/settings/activity-log" element={<Activity decryptedIsUserAdmin={decryptedIsUserAdmin}/>} />
                          <Route path="/settings/account" element={<Account decryptedIsUserAdmin={decryptedIsUserAdmin}/>} />
                        </Routes>
                    </div>
                  </div>
                </div>

            </div>
            <div className={`h-10 `}></div>
          </div>
          
        </div>
    </div>
  )
}
// {/* Sidebar for Small Screen*/}
// <div className={` grid-admin-sidebar xxs:block lg:hidden top-0 z-20  bg-[#F9FBFD]  xxs:w-full 
//   ${isSidebarOpen ? 'xxs:h-80 ':'xxs:h-24'} transition-height duration-300 delay-150`}>
// 
// </div>
// {/* Sidebar for Large Screen*/}
// <div className={`grid-admin-sidebar  xxs:hidden lg:block left-0 top-0 z-20 bg-[#F9FBFD] lg:h-screen shadow-2xl 
//   ${isSidebarOpen ? 'lg:w-64':'lg:w-20'}  transition-width duration-300 delay-150 `}>
    
// <Sidebar decryptedIsUserAdmin={decryptedIsUserAdmin} isSidebarOpen={isSidebarOpen} handleSidebarToggle={handleSidebarToggle}/>
// </div>
// {/* Header for Small Screen */}
// <div className={`grid-admin-header hidden z-20 bg-[#fafafa] ${isSidebarOpen ? 'xxs:top-80':'xxs:top-24 '} h-24 w-full shadow-sm`}>
//     <Header/>
// </div>
// {/* Header for Large Screen */}
// <div className={` grid-admin-header bg-[#fafafa]  top-0 right-0 z-20 h-24 w-full   shadow-sm`}>
//     
// </div>

// <div className={` grid-admin-main bg-red-200 h-full w-full`}>
//   sdss
    
// </div>