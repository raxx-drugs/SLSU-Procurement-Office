import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Search, Plus, Filter, ChevronLeft, ChevronRight, Trash, Mail, CircleArrowLeft} from "lucide-react";
import { useDataFilters } from "../utils/useDataFilters.js";
import { usePagination } from "../hooks/manage user/usePagination";
import { useDataManagement } from "../hooks/DataManagement";
import { useNavigate } from "react-router-dom";
import { StatCard } from "../components/manage user/StatCard";
import { useFetchPR } from "../hooks/pr/FetchPr.js";
import { TableRows } from "../components/paper/TableRows.jsx";
import { useFetchUser } from "../hooks/user/FetchUser.js";
import useDeletePr from '../hooks/pr/DeletePrMonitor.js'
import DisplayFile from "../components/paper/DisplayFile.jsx";
import GetFile from "../components/paper/GetFile.jsx";


export default function PrMonitor() {
    const { prData, refetchPr } = useFetchPR();
    const {unitList} = useFetchUser();
    const navigate = useNavigate();
    const [showPDF, setShowPDF] = useState(false)
    const [initialPr, setInitialPr] = useState([]);


        // Data transformation and setting initial pr data
    useEffect(() => {
        if (prData && prData.length > 0) {
            setInitialPr(prData);
        }
    }, [prData]);
    
    const { data: prEntries, addData, updateData, deleteData, toggleDataStatus } = useDataManagement(initialPr);

    const {
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        departmentFilter,
        setDepartmentFilter,
        applyDataFilters,
      } = useDataFilters();
        // Apply filters to pr data

    const filteredPr = useMemo(() => applyDataFilters(prEntries), [prEntries, applyDataFilters]);
    const { currentPage, totalPages, paginatedItems: currentPagePr, goToPage } = usePagination(filteredPr, 10);
    const [selectedPr, setSelectedPr] = useState([]);
    const handleSelectAll = useCallback(
        (e) => setSelectedPr(e.target.checked ? prEntries.map((prEntries) => prEntries.id) : []),
        [prEntries]
    );
    const handleSelectPr = useCallback((id) => {
        setSelectedPr((prev) => (prev.includes(id) ? prev.filter((prEntries) => prEntries !== id) : [...prev, id]));
    }, []);

    const deletePr = useDeletePr();
    const handleDeleteSelected = useCallback( async() => {
    if (window.confirm("Are you sure you want to delete selected entries?")) {
        selectedPr.forEach((id) => deleteData(id));
      

        await deletePr(selectedPr);
        }
    }, [selectedPr, deleteData]);


    const handleViewPDF = useCallback((fileToShow) => {
      console.log(fileToShow)
        if(!showPDF){
          console.log(`http://localhost:5000/uploads/${fileToShow}`)
          setShowPDF(`http://localhost:5000/uploads/${fileToShow}`)
        }else{
          setShowPDF(null)
        }
      },[showPDF])



      return (
        <div className="h-full flex flex-col">
          <div className="flex-grow p-4 md:p-8  relative">
            <div className="w-full mb-10">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#e2e2e2]">PR Dashboard</h1>
                  <p className="text-sm text-gray-500">Collection of all Pr's</p>
                </div>
                <button
                  onClick={() => navigate("/add-entry")}
                  className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entry
                </button>
              </div>
    
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard icon={Filter} title="Total Entries" value={prEntries.length} color="blue" />
                <StatCard icon={Filter} title="Pending" value={prEntries.filter((entry) => entry.status === "Pending").length} color="orange" />
                <StatCard icon={Filter} title="In Progress" value={prEntries.filter((entry) => entry.status === "In Progress").length} color="blue" />
                <StatCard icon={Filter} title="Done" value={prEntries.filter((entry) => entry.status === "Done").length} color="green" />
              </div>
    
              {/* Main Content */}
              <div className="bg-white dark:bg-[#252728] rounded-xl border dark:border-gray-500 overflow-hidden shadow-sm">
                {/* Filters and Search */}
                <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b dark:border-gray-600">
                  <div className="flex flex-wrap items-center gap-2">
                    <button className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-[#e2e2e2]  bg-gray-100 dark:bg-[#3B3D3E] rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                    <select
                      className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-[#e2e2e2]  bg-white dark:bg-[#3B3D3E] border dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                    <select
                      className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-[#e2e2e2]  bg-white dark:bg-[#3B3D3E] border  dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                      
                      <option value="all">All departments</option>
                      {unitList && unitList.map((department, index) => (
                        <option key={index} value={department}>
                          {department}
                        </option>
                      ))}
                     
    
                    </select>
                    {selectedPr.length > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleDeleteSelected}
                          className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                        >
                          <Trash className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                        
                      </div>
                    )}
                  </div>
                  <div className="relative w-full sm:w-auto">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by description"
                      className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
    
                {/* Table */}
                <div className="overflow-x-auto">
                  <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-white dark:bg-[#3B3D3E] z-10">
                        <tr className="border-b  bg-gray-50 dark:bg-[#3B3D3E]">
                          <th className="px-4 py-3 text-left">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
                              checked={selectedPr.length === prEntries.length}
                              onChange={handleSelectAll}
                            />
                          </th>
                          {[
                            "File",
                            "Unit",
                            "PR Number",
                            "Type",
                            "Title",
                            "Status",
                            "Last Date Modified",
                            "Remarks",
                            "Actions",
                          ].map((header) => (
                            <th key={header} className="px-4 py-3 text-left">
                              <span className="text-xs font-semibold text-gray-600 dark:text-[#e2e2e2]  uppercase tracking-wider">{header}</span>
                            </th>
                          ))}
                        </tr>
                        </thead>
                      <tbody>
                        {currentPagePr.map((entry) => (
                          <TableRows
                            key={entry.id}
                            data={entry}
                            isSelected={selectedPr.includes(entry.id)}
                            onSelect={handleSelectPr}
                            onActivate={toggleDataStatus}
                            onDelete={deleteData}
                            onEdit={updateData}
                            handleViewPDF={handleViewPDF}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
    
               
              </div>
            </div>
    
              {showPDF && 
                <div className={`left-0 top-2 w-full absolute h-full z-50  p-5`}>
                  <div className={`w-full h-full bg-gradient-to-b from-blue-50 to-white flex flex-col overflow-y-auto`}>
                    <div className={`w-full p-4 px-5`}>
                      <i onClick={() => setShowPDF(null)} className="text-gray-600 hover:text-gray-700 cursor-pointer">
                        <CircleArrowLeft />
                      </i>
                    </div>
                    
                    {showPDF && <GetFile showPDF={showPDF} />}
    
                  </div>
                </div>
              }
               {/* Pagination */}
               <div className="bg-[#fafafa] dark:bg-[#1F1F1F] p-2.5 fixed bottom-0 right-0 w-full  flex flex-col sm:flex-row items-center justify-end gap-4">
                  <div className="text-sm text-gray-500 dark:text-[#e2e2e2]">
                    Showing {currentPage === totalPages ? filteredPr.length % 5 : 0} of   {filteredPr.length}{" "} 
                    Pr's
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                      disabled={currentPage === 1}
                      onClick={() => goToPage(currentPage - 1)}
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600 " />
                    </button>
                    <span className="text-sm text-gray-600 dark:text-[#e2e2e2]">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                      disabled={currentPage === totalPages}
                      onClick={() => goToPage(currentPage + 1)}
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
          </div>
        </div>
      )
}
