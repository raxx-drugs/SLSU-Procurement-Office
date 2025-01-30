import { useState, useCallback } from "react"

export const usePagination = (items, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToPage = useCallback(
    (page) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    },
    [totalPages],
  )

  return { currentPage, totalPages, paginatedItems, goToPage }
}

