import React, { useState, useCallback, useMemo, useEffect } from "react"
import { Search, Users, Plus, Filter, ChevronLeft, ChevronRight, Trash, Mail } from "lucide-react"
import { useAccounts } from "../hooks/manage user/useAccounts"
import { useFilters } from "../hooks/manage user/useFilters"
import { usePagination } from "../hooks/manage user/usePagination"
import { StatCard } from "../components/manage user/StatCard"
import { AccountRow } from "../components/manage user/AccountRow"
import { useFetchUser } from "../hooks/user/FetchUser"
import { useFetchUserLogin } from "../hooks/user/FetchUserLogin"
import { useNavigate } from "react-router-dom"

const AccountsDashboard = () => {
  const { userList } = useFetchUser();
  const navigate = useNavigate()
  const {userLoginDetails, refetchUsersLogin} = useFetchUserLogin();

  const [initialAccounts, setInitialAccounts] = useState([]);

  useEffect(() => {
    const fetchAndTransformAccounts = async () => {
      try {
        if (userList && userList.length > 0) {
          const transformedAccounts = await Promise.all(
            userList.map(async (user) => {
              try {
                const response = await refetchUsersLogin(user.fname); // Fetch the last login details
                const lastLogin = response?.createdAt
                  ? new Date(response.createdAt).toLocaleString()
                  : "N/A";
  
                return {
                  id: user._id,
                  name: `${user.fname || ""} ${user.lname || ""}`.trim(),
                  email: user.email || "No email provided",
                  status: user.isAdmin ? "Admin" : "Client",
                 
                  createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
                  updatedAt: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A",
                  lastLogin,
                  password: user.password || "No password",
                };
              } catch (fetchError) {
                console.error("Error fetching login details for user:", user.fname, fetchError);
                return null; // Skip this user if fetching login details fails
              }
            })
          );
  
          // Filter out null values in case of any fetch failures
          setInitialAccounts(transformedAccounts.filter(Boolean));
          console.log("Transformed Accounts:", transformedAccounts);
        }
      } catch (error) {
        console.error("Error transforming accounts:", error);
      }
    };
  
    fetchAndTransformAccounts();
  }, [userList, refetchUsersLogin]);
  

  const { accounts, addAccount, updateAccount, deleteAccount, toggleAccountStatus } = useAccounts(initialAccounts);
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    applyFilters,
  } = useFilters();
  const filteredAccounts = useMemo(() => applyFilters(accounts), [accounts, applyFilters]);
  const { currentPage, totalPages, paginatedItems: currentPageAccounts, goToPage } = usePagination(filteredAccounts, 10);

  const [selectedAccounts, setSelectedAccounts] = useState([]);

  const handleSelectAll = useCallback(
    (e) => setSelectedAccounts(e.target.checked ? accounts.map((account) => account.id) : []),
    [accounts]
  );

  const handleSelectAccount = useCallback((id) => {
    setSelectedAccounts((prev) => (prev.includes(id) ? prev.filter((accountId) => accountId !== id) : [...prev, id]));
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (window.confirm("Are you sure you want to delete selected accounts?")) {
      selectedAccounts.forEach((id) => deleteAccount(id));
      setSelectedAccounts([]);
    }
  }, [selectedAccounts, deleteAccount]);

  const handleEditAccount = useCallback((account) => {
    console.log("Edit account:", account);
  
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="h-full min-h-full flex-grow p-4 md:p-8  relative">
        <div className="w-full mb-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa]">Accounts</h1>
              <p className="text-sm text-gray-500">Manage user roles and access.</p>
            </div>
            <button
              onClick={() => navigate('/add-user')}
              className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New account
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Users} title="Total members" value={accounts.length} color="blue" />
            <StatCard
              icon={Users}
              title="Admin members"
              value={accounts.filter((account) => account.status === "Admin").length}
              color="green"
            />
            <StatCard
              icon={Users}
              title="Client members"
              value={accounts.filter((account) => account.status === "Client").length}
              color="red"
            />
            <StatCard
              icon={Users}
              title="Departments"
              value={new Set(accounts.map((account) => account.tags)).size}
              color="purple"
            />
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-[#252728]  rounded-xl border overflow-hidden shadow-sm relative">
            {/* Filters and Search */}
            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b">
              <div className="flex flex-wrap items-center gap-2">
                <button className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-[#e2e2e2] bg-gray-100 dark:bg-[#3B3D3E] rounded-lg hover:bg-gray-200 dark:hover:bg-[#46484B] transition-colors inline-flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
                <select
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-[#e2e2e2] bg-white dark:bg-[#3B3D3E] border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All status</option>
                  <option value="admin">Admin</option>
                  <option value="client">Client</option>
                </select>
                {selectedAccounts.length > 0 && (
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
                  placeholder="Search by name or ID"
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className=" max-h-[calc(100vh-300px)]">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white dark:bg-[#3B3D3E]">
                    <tr className="border-b bg-gray-50 dark:bg-[#3B3D3E]">
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          checked={selectedAccounts.length === accounts.length}
                          onChange={handleSelectAll}
                        />
                      </th>
                      {[
                        "Name",
                        "Status",
                        "Last Login",
                        "Date Account Created",
                        "Last Modified",
                        "Actions",
                      ].map((header) => (
                        <th key={header} className="px-4 py-3 text-left">
                          <span className="text-xs font-semibold text-gray-600 dark:text-[#e2e2e2] uppercase tracking-wider">{header}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentPageAccounts.map((account) => (
                      <AccountRow
                        key={account.id}
                        account={account}
                        isSelected={selectedAccounts.includes(account.id)}
                        onSelect={handleSelectAccount}
                        onActivate={toggleAccountStatus}
                        onDelete={deleteAccount}
                        onEdit={handleEditAccount}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

    
          </div>
        </div>
          {/* Pagination */}
          <div className="bg-[#fafafa] dark:bg-[#1F1F1F] p-2.5 fixed bottom-0 right-0 w-full flex flex-col sm:flex-row items-center justify-end gap-4">
              <div className="text-sm text-gray-500">
                Showing {currentPage === totalPages ? filteredAccounts.length % 5 : 5} of   {filteredAccounts.length}{" "} 
                accounts
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <span className="text-sm text-gray-600">
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

export default AccountsDashboard

