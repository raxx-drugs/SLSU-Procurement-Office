import { useState, useCallback, useEffect } from "react";

export const useDataManagement = (initialData = []) => {
  const [data, setData] = useState(initialData);
  

  useEffect(() => {
    if (initialData && initialData.length > 0) {

        setData(initialData);
    }
  }, [initialData]);

  const addData = useCallback((newItem) => {
    setData((prev) => [...prev, { ...newItem, id: Date.now().toString() }]);
  }, []);

  const updateData = useCallback((updatedItem) => {
    setData((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  }, []);

  const deleteData = useCallback((id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleDataStatus = useCallback((id, statusKey = "Pending", active = "In Progress", inactive = "Done") => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [statusKey]: item[statusKey] === active ? inactive : active } : item
      )
    );
  }, []);

  return { data, addData, updateData, deleteData, toggleDataStatus };
};
