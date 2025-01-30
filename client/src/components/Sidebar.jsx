import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/SLSU logo.png';
import { 
    IoHomeOutline, IoPeopleOutline, IoSettingsOutline, IoMenuOutline, IoBagOutline, 
    IoChevronDownOutline, IoChevronUpOutline, IoListOutline, IoAlbumsOutline, 
    IoDocumentTextOutline, IoPricetagsOutline, IoReceiptOutline, IoClipboardOutline, IoReaderOutline 
} from "react-icons/io5";

// Sidebar button links configuration
const btnLinks = [
    { to: "/dashboard", icon: <IoHomeOutline />, label: 'Dashboard' },
    { 
        label: 'Procure', icon: <IoBagOutline />, subLinks: [
            { to: '/file-collection', label: 'File Collection', icon: <IoAlbumsOutline className={`size-4 `}/> },
            { to: '/pr-monitor', label: 'PR Monitor', icon: <IoDocumentTextOutline className={`size-4 `}/>,},
            { to: '/add-entry', label: 'Add Entry', icon: <IoReceiptOutline className={`size-4 `}/> },
        ]
    },
    { to: "/manage-user", icon: <IoPeopleOutline />, label: 'Manage User',isAdminOnly: true },
    { 
        label: 'Tasks', icon: <IoListOutline />, subLinks: [
            { to: '/task-board', label: 'Task Board', icon: <IoClipboardOutline className={`size-4 `}/> },
            { to: '/task-details', label: 'Task Details', icon: <IoReaderOutline className={`size-4 `}/> }
        ]
    },
    { 
        label: 'Settings', icon: <IoSettingsOutline />, subLinks: [
            { to: '/settings/activity-log', label: 'Activity Log', icon: <IoClipboardOutline className={`size-4 `}/> },
            { to: '/settings/notification', label: 'Notification', icon: <IoReaderOutline className={`size-4 `}/> },
            { to: '/settings/account', label: 'Account settings', icon: <IoReaderOutline className={`size-4 `}/> }
        ]
    },
];

// Dropdown component for reusable dropdown logic
const Dropdown = ({label, icon, subLinks, isSidebarOpen, isOpen, toggleDropdown, isAdmin }) => {
    const location = useLocation();
    const isActive = subLinks.some(link => location.pathname === link.to);

    return (
        <div className={`w-full relative`}> 
            <button 
                onClick={toggleDropdown} 
                className={`
                    ${isSidebarOpen ? 'sideBarBtn ':'sideBarBtnIcon xxs:-ml-10 lg:ml-0'} 
                    w-full transition-[margin] duration-300 delay-150 text-nowrap relative
                    px-8 dark:hover:text-gray-100 dark:hover:bg-[#3B3D3E]
                    ${isActive ? 'bg-slate-300 text-slate-700 dark:bg-[#333334] dark:text-[#e2e2e2]' : ''}`}
            >
                <div className={` w-full flex  items-center gap-10`}>
                    <span className={``}>{icon}</span>
                    <span className={` transition-transform duration-300 delay-150 ${isSidebarOpen ? 'lg:scale-100' : 'lg:scale-0'}`}>{label}</span>
                </div>
                {isOpen ? 
                    <IoChevronUpOutline /> : 
                    <IoChevronDownOutline />}
            </button>
            {isOpen && (
                <div className={`top-full left-0 mt-1 w-full z-10 text-xs`}>
                    {subLinks
                        .filter(({ isAdminOnly }) => !isAdminOnly || (isAdminOnly && isAdmin)) // Apply filtering for sublinks
                        .map(({ to, label, icon }) => (
                        <Link key={to} to={to}>
                            <div className={` 
                                py-2 ${isSidebarOpen ? 'ml-16':'ml-9'} 
                                h-8 max-h-8
                                text-nowrap relative transition-[margin] duration-300 delay-150  
                                hover:text-slate-900  group-hover:text-[#5dce65] 
                                dark:hover:text-[#5dce65]   dark:group-hover:text-[#5dce65] 
                                ${location.pathname === to ? 'text-[#2b9732]' : 'text-darkText2'} flex items-center  gap-1`}>
                                <div className={`size-2 rounded-full transition-[margin] duration-300 delay-150  ${location.pathname === to ? 'bg-[#61ca68]' : 'bg-slate-500'}`}></div>
                                <span>{icon}</span>
                                <span className={`transition-transform duration-300 delay-150 ${isSidebarOpen ? 'lg:scale-100' : 'lg:scale-0'} `}>{label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

// Sidebar button component with logic for dropdowns
const SidebarButtons = ({ decryptedIsUserAdmin, isSidebarOpen }) => {

    const location = useLocation();
    const [dropdownState, setDropdownState] = useState({ Tasks: false, Procure: false });

    const toggleDropdown = (label) => {
        setDropdownState(prevState => ({ ...prevState, [label]: !prevState[label] }));
    };

    return btnLinks
        .filter(({ isAdminOnly }) => !isAdminOnly || (isAdminOnly && decryptedIsUserAdmin)) // Check if button should be shown
        .map(({ to, icon, label, subLinks }) => {
        const isActive = location.pathname === to;

        if (subLinks) {
            return (
                <Dropdown 
                    key={label} 
                    label={label} 
                    icon={icon} 
                    subLinks={subLinks} 
                    isSidebarOpen={isSidebarOpen} 
                    isOpen={dropdownState[label]} 
                    toggleDropdown={() => toggleDropdown(label)} 
                    isAdmin={decryptedIsUserAdmin}
                />
            );
        }
        return (
         
            <Link key={to} to={to} className={`w-full`}>
                <div className={`
                    ${isSidebarOpen ? 'sideBarBtn' : 'sideBarBtnIcon xxs:-ml-10 lg:ml-0'} 
                    gap-10 px-8 w-full transition-[margin] duration-300 delay-150 text-nowrap 
                    dark:hover:text-gray-100 dark:hover:bg-[#3B3D3E]
                    ${isActive ? 'bg-slate-300 text-slate-900 dark:bg-[#333334] dark:text-[#e2e2e2]' : ''} `}>
                    <span className={``}>{icon}</span>
                    <span className={`transition-transform duration-300 delay-150  ${isSidebarOpen ? 'lg:scale-100' : 'lg:scale-0'}`}>{label}</span>
                </div>
            </Link>
        );
    });
};


export default function Sidebar({ decryptedIsUserAdmin, isSidebarOpen, handleSidebarToggle }) {
    return (
        <div className={`h-full w-full flex flex-row lg:flex-col justify-between  `}>
            {/* Menu nav button section */}
            <div className={`h-auto flex-grow  flex flex-col overflow-hidden `}>

                {/* Logo Section */}
                <div className={`flex  lg:justify-center min-h-24 items-center `}>
                    <img src={logo} alt="" className={`size-12 xxs:ml-5 lg:ml-0 ${isSidebarOpen ? 'transition-transform duration-300 delay-150 lg:scale-125':'transition-transform duration-300 delay-150 lg:scale-100'}`}/>
                </div>
                {/* navigaiton Section */}
                <div className={`full  flex-col overflow-x-hidden`}>
                    <SidebarButtons isSidebarOpen={isSidebarOpen} decryptedIsUserAdmin={decryptedIsUserAdmin}/>
                </div>
            </div>
            {/* Menu toggle section */}
            <div className={`lg:h-14 flex items-start justify-end relative dark:bg-[#252728] `}>
                <button className={`
                    lg:w-full lg:h-full lg:top-0 lg:right-0 lg:flex lg:justify-end  lg:items-center
                    absolute top-8 right-5 cursor-pointer

                    `} onClick={() => handleSidebarToggle()}>
                    <IoMenuOutline className={`size-8 `}/>
                </button>

            </div>
        </div>
    );
}

