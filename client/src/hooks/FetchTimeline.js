import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDecryptUserData } from './user/DecryptUserData';
import { useSelector } from 'react-redux';

export function useFetchTimeline() {
    const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData();
    const [prByPrNo, setPrByPrNo] = useState();
   
    const fetchTimeline = useCallback(async ({ prNo } = {}) => {
      try {
        console.log(prNo)

        let url;
        if(prNo){
            url = `/api/paper/timeline/pr/${prNo}`; // Fetch specific PR
            const response = await axios.get(url);
            if (response.data.list) {                
                setPrByPrNo(response.data.list);  // Extract user data from response
          }else {
              setPrById([]);  // Set empty if no data is returned
          }
        }
      } catch (error) {
        console.error("Error fetching papers:", error.message);
      }
    }, [decryptedData, decryptedIsUserAdmin, decryptedCurrentuser]);

  
    // Initial fetch when the component mounts
    useEffect(() => {
        fetchTimeline();
    }, [fetchTimeline]);

  return { prByPrNo, refetchTimeline: fetchTimeline };
}