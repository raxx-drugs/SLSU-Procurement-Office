import React, { useState, useEffect } from 'react';
import { IoAlertCircleOutline, IoNewspaperOutline, IoWalkOutline, IoCheckmarkDoneOutline, IoSadOutline } from "react-icons/io5";
import LineChart from '../components/dashboard/LineChart';
import { useFetchPPMP } from '../hooks/ppmp/FetchPPMP.js'; 
import { useFetchPR } from '../hooks/pr/FetchPr.js';
import { useDecryptUserData } from '../hooks/user/DecryptUserData.js';

// Card configuration
const cardData = [
  { title: "Number of file Entries", icon: <IoNewspaperOutline className='size-10 text-[#8180c5]' />, color: "bg-slate-700", description: "Number of Files Uploaded" },
  { title: "Pr Submitted", icon: <IoCheckmarkDoneOutline className='size-10 text-[#8180c5]' />, color: "bg-green-500", description: "Total Number of PR Submitted" },
  { title: "Total PPMP", icon: <IoAlertCircleOutline className='size-10 text-[#8180c5]' />, color: "bg-orange-500", description: "Total Number of PPMP Submitted" },//render this only when the decryptedIsUserAdmin os false
  { title: "Total ABC(PHP)", icon: <IoWalkOutline className='size-10 text-[#8180c5]' />, color: "bg-blue-500", description: "Total Allocated Budget" },
];
// Card component
const Card = ({ title, value, icon, color, description }) => (
  <div className="bg-gray-200 dark:bg-[#333334] shadow-md flex-grow h-40 flex justify-start px-4 rounded-lg min-w-[250px] lg:border-l-4 xl:border-l-0 border-slate-300 hover:bg-gray-300 dark:hover:bg-[#3B3D3E]">
      <div className="flex flex-col justify-center flex-grow ">
          <div className="flex items-center gap-2">
              <div className={`size-2 rounded-full ${color}`}></div>
              <span className="opacity-60">{title}</span>
          </div>
          <div className="text-3xl font-semibold">{value || 'No data!'}</div>
          <span className="text-xs opacity-40">{description}</span>
      </div>
      <div className=" flex justify-center items-center">
          {icon}
      </div>
  </div>
);


// Status badge component
const StatusBadge = ({ status }) => {
    const statusColors = {
        Pending: "bg-orange-500 text-white",
        'In Progress': "bg-blue-500 text-white",
        Done: "bg-green-500 text-white",
    };
  
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-500'}`}>
            {status}
        </span>
    );
  };


  // Table component for Section 3 Column 1
const Table = ({ tableTitle, headers, rows, statusColumn }) => (
  <div className={` overflow-x-auto`}>
    <h1 className={`text-lg font-semibold text-gray-600 dark:text-[#e2e2e2] `}>{tableTitle}</h1>
    <table className="table-auto w-full">
        <thead>
            <tr className="bg-slate-200 dark:bg-[#252728]  shadow-md">
                {headers.map((header, index) => (
                    <td key={index} className={`${index === 1 ? 'sticky left-0 backdrop-blur-md ' : ''} px-3 py-2 text-center`}>{header}</td>
                ))}
            </tr>
        </thead>
        <tbody >
        

        {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
                <tr key={rowIndex} className=" hover:bg-gray-200 dark:hover:bg-[#3B3D3E]">
                    {row.map((cell, cellIndex) => (
                        <td key={cellIndex} 
                            className={`${cellIndex === 1 ? 'sticky left-0 backdrop-blur-sm shadow-md' : ''} px-3 py-2 text-center`}
                            >
                            {cellIndex === statusColumn ? <StatusBadge status={cell} /> : cell} 
                        </td>
                    ))}
                </tr>

            ))):(<tr className={`w-full h-full flex justify-center items-center gap-4`}>
                <td> <IoSadOutline className={`size-20 `}/><h1 className={`text-xl `}>No Uploads yet!</h1></td></tr>)
            }
        </tbody>
        
    </table>
  </div>
);


export default function Dashboard() {
    const { ppmpData, count, countUnit, totalBudget, entriesThisYear, ppmpRecentEntries, refetchPPMP } = useFetchPPMP();
    const { prData, prCount, prCountUnit, prTotalABC, prEntriesThisYear, prRecentUploads,  refetchPR }  = useFetchPR();

    const {decryptedCurrentuser, decryptedIsUserAdmin}=useDecryptUserData();

    console.log(decryptedIsUserAdmin)


    // Dynamic state for card values
    const [cardValues, setCardValues] = useState([]);

    useEffect(() => {
        if(ppmpData &&  prData && cardValues && ppmpData.length > 0 || prData.length > 0){
        const totalCount = (count || 0) + (prCount || 0);
        // Update card values based on fetched data
        setCardValues([totalCount,count, prCount, "₱" + (prTotalABC || 0)]);
        }else{
            refetchPPMP();
        }
    }, [ppmpData, count, countUnit, prTotalABC, entriesThisYear, prCountUnit]);

    // Utility function to truncate text
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };


    //Table Title
    const tableTitle = ["Recent Uploads for PPMP", "Recent Uploads for PR"];

    // Table data for Section Recent Uploads (maximum 5 rows)
    const tableHeadersRecentPPMP = ["#", "Unit", "Title", "Fund Source", "Total Budget", "Last Modified"];
    const tableHeadersRecentPR = ["#", "Unit", "PR No.", "Title", "Mode", "Total ABC", "Status",  "Last Modified"];

    const [tableRowsRecentPPMP, setTableRowsRecentPPMP] = useState([]);
    const [tableRowsRecentPR, setTableRowsRecentPR] = useState([]);

    useEffect(() => {
        if (ppmpRecentEntries) {
            const rows = ppmpRecentEntries.slice(0, 5).map((upload, index) => [
                index + 1, // Row number
                truncateText(upload.unit, 20),
                truncateText(upload.description, 50), // Clip description to 50 characters
                upload.mode,
                upload.estimatedBudget,
                new Date(upload.updatedAt).toLocaleDateString(), // Format the date
            ]);
            setTableRowsRecentPPMP(rows);
        }

        if (prRecentUploads) {
            const rows = prRecentUploads.slice(0, 5).map((upload, index) => [
                index + 1, // Row number
                truncateText(upload.unit, 20),
                upload.prNo,
                truncateText(upload.title, 50),
                upload.mode,
                upload.abc,
                upload.status,
                new Date(upload.updatedAt).toLocaleDateString(), // Format the date
            ]);
            setTableRowsRecentPR(rows);
        }
    }, [ppmpRecentEntries, prRecentUploads]);

  return (
    <div className="w-full h-full p-5">
        {/* Main content */}
        <div className="h-full w-full flex">
            <div className="w-full flex flex-col gap-5 ">
                {/* Section 1: Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {cardData.map(({ title, icon, color, description }, index) => (
                        <Card
                            key={index}
                            title={title}
                            value={cardValues[index]} // Use dynamic value from state
                            icon={icon}
                            color={color}
                            description={description}
                         
                        />
                    ))}
                </div>
                {/* Section 2 */}
                <div className="min-h-80 w-full flex flex-wrap gap-5 ">
                    {/* Section 2 Column 2 (Line Chart)*/}
                    <div className="bg-gray-100 dark:bg-[#333334] shadow-md flex-grow flex flex-col min-w-80 rounded-lg py-4 gap-2 overflow-x-auto ">
                        <LineChart />
                    </div>
                </div>
                        {/* Section 3 */}
                <div className={`bg-gray-100 dark:bg-[#333334] shadow-md rounded-lg min-h-80 w-full p-2`}>
                    {ppmpData && <Table tableTitle={tableTitle[0]} headers={tableHeadersRecentPPMP} rows={tableRowsRecentPPMP} />}
                </div>
                {/* Section 3 */}
                <div className={`bg-gray-100 dark:bg-[#333334] shadow-md rounded-lg min-h-80 w-full p-2`}>
                    {ppmpData && <Table tableTitle={tableTitle[1]} headers={tableHeadersRecentPR} rows={tableRowsRecentPR} statusColumn={6}/>}
                </div>
            </div>
        </div>
    </div>
  );
}
