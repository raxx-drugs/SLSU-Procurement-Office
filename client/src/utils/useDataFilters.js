import { useState, useCallback } from "react"

export const useDataFilters = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const applyDataFilters = useCallback(
    (data) => {
      return data.filter((data) => {
        // Check if account.name and account.memberId exist before calling .toLowerCase()
        const matchesSearch =
          (data.unit?.toLowerCase()?.includes(searchQuery.toLowerCase()) || 
          data.title?.toLowerCase()?.includes(searchQuery.toLowerCase())) ?? false
        
        // Check if account.status exists before calling .toLowerCase()
        const matchesStatus =
          statusFilter === "all" || 
          (data.status?.toLowerCase() === statusFilter.toLowerCase())

          // Check if account.tags exists before calling .toLowerCase()
        const matchesDepartment =
        departmentFilter === "all" || 
        (data.unit?.toLowerCase() === departmentFilter.toLowerCase())
        
        
        
        return matchesSearch && matchesStatus && matchesDepartment
      })
    },
    [searchQuery, statusFilter, departmentFilter],
  )

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    applyDataFilters,
  }
}

