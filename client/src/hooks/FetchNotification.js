import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDecryptUserData } from './user/DecryptUserData';
import { useSelector } from 'react-redux';

export function useFetchNotification() {
    const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData();
    const [notifications, setNotifications] = useState();
    const [archives, setArchives] = useState();
   
    const fetchNotification = useCallback(async () => {
      try {
        let url;
        if(decryptedCurrentuser){
            url = `/api/paper/notification/unread/unit/${decryptedCurrentuser}`; // Fetch specific PR
            const response = await axios.get(url);

            if (response.data.list) {    
               // Filter out notifications where read is true
               const unreadNotifications = response.data.list.filter(notif => !notif.read);          
              setNotifications(unreadNotifications);  // Extract user data from response
              
              const archivedNotifications = response.data.list.filter(notif => notif.read === true);  
              setArchives(archivedNotifications);
          }else {
            setNotifications([]);  // Set empty if no data is returned
          }
        }
      } catch (error) {
        console.error("Error fetching papers:", error.message);
      }
    }, [decryptedData, decryptedIsUserAdmin, decryptedCurrentuser]);

  
    // Initial fetch when the component mounts
    useEffect(() => {
        fetchNotification();
        const interval = setInterval(() => {
          fetchNotification();
      }, 3000); // Fetch every 5 seconds

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }, [fetchNotification]);

  return { notifications, archives, refetchNotification: fetchNotification };
}