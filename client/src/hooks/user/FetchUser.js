import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDecryptUserData } from '../user/DecryptUserData';

export function useFetchUser() {
    const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData();
    const [userList, setUserList] = useState();
    const [unitList, setUnitList] = useState();
   

    const fetchUsers = useCallback(async () => {
      try {

        // Make sure decryptedData exists and contains the necessary info
        if (!decryptedData || !decryptedData.data || !decryptedData.data._id) {
          return;
      }
        let url;
        if (decryptedIsUserAdmin) {
         
          url = `/api/user/`; // Admin endpoint
        } else {
          const userId = decryptedData.data._id;  // Extract userId from decrypted current user
          url = `/api/user/${userId}`; // User-specific endpoint
        }

        const response = await axios.get(url);
        //console.log('API Response:', response);  // Log the entire response object
        // Check if response.data exists before accessing it
          if (!response.data) {
            console.error('Response data is null or undefined');
            return;
          }
        // Check if the response data exists before destructuring
        const { count, unitList = [], data = [] } = response.data || {};  // Default to empty arrays if they are undefined


          // Make sure the data is valid
        if (data) {
          //console.log(data);
          setUserList(data);  // Set user data
          //console.log(unitList);  // Log unit list for debugging
          setUnitList(unitList); // Set unit list
        } else {
          console.error('No data received from API');
        }

      } catch (error) {
        console.error("Error fetching papers:", error.message);
      }
    }, [decryptedData, decryptedIsUserAdmin, decryptedCurrentuser]);

  
    // Initial fetch when the component mounts
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

  return { unitList, userList, refetchUsers: fetchUsers };
}