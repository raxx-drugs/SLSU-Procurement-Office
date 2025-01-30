import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDecryptUserData } from '../user/DecryptUserData';
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/formatDate';

export function useFetchPPMPById() {
  const { decryptedData, decryptedCurrentuser } = useDecryptUserData();
  const [ppmpById, setPpmpById] = useState(null); // Store the fetched PPMP by ID data
  const { currentPPMPDetails } = useSelector((state) => state.user); // Get PPMP details from Redux state
  const [loading, setLoading] = useState(false); // Add a loading state
  const [error, setError] = useState(null); // Add an error state

  const fetchPPMPById = useCallback(
    async ({ ppmpId } = {}) => {
      try {
        setLoading(true);
        setError(null); // Reset error state before fetching


        if (ppmpId) {
          console.log(ppmpId)
          const url = `/api/paper/ppmp/${ppmpId}`; // Fetch PPMP entry by ID
          const response = await axios.get(url);

          if (response?.data) {
            const item = response.data;
            setPpmpById(item.data); // Set the transformed data
            console.log(item.data)
          } 
        }
      } catch (error) {
        console.error("Error fetching PPMP by ID:", error.message);
        setError("Failed to fetch PPMP data. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [currentPPMPDetails, decryptedCurrentuser]
  );

  // Initial fetch when the component mounts
  useEffect(() => {
    fetchPPMPById();
  }, [fetchPPMPById]);

  return { ppmpById, loading, error, refetchPPMPById: fetchPPMPById };
}
