import { useState, useCallback, useEffect } from "react"

export const useAccounts = (initialAccounts) => {
  const [accounts, setAccounts] = useState([]);
  // Update accounts when initialAccounts changes
  useEffect(() => {
    if (initialAccounts && initialAccounts.length > 0) {
      setAccounts(initialAccounts);
    }
  }, [initialAccounts]);

  const addAccount = useCallback((account) => {
    setAccounts((prev) => [...prev, { ...account, id: Date.now().toString() }])
  }, [])

  const updateAccount = useCallback((updatedAccount) => {
    setAccounts((prev) => prev.map((account) => (account.id === updatedAccount.id ? updatedAccount : account)))
  }, [])

  const deleteAccount = useCallback((id) => {
    setAccounts((prev) => prev.filter((account) => account.id !== id))
  }, [])

  const toggleAccountStatus = useCallback((id) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === id ? { ...account, status: account.status === "Active" ? "Inactive" : "Active" } : account,
      ),
    )
  }, [])

  return { accounts, addAccount, updateAccount, deleteAccount, toggleAccountStatus }
}

