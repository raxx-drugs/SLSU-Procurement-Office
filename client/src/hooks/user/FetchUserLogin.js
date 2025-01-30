import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDecryptUserData } from '../user/DecryptUserData';

export function useFetchUserLogin() {
    const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData();
    const [userLoginDetails, setUserLoginDetails] = useState();


    const fetchUsersLogin = useCallback(async (unit) => {
      try {
        if (!unit) return null; // Return early if no ID
        const response = await axios.get(`/api/user/login/${unit}`);
        setUserLoginDetails( response?.data || null);
        return response?.data || null; // Return the fetched data
      } catch (error) {
        console.error("Error fetching user login details:", error.message);
        return null;
      }
    }, []);

  
    // Initial fetch when the component mounts
    useEffect(() => {
      fetchUsersLogin();
    }, [fetchUsersLogin]);

  return { userLoginDetails, refetchUsersLogin: fetchUsersLogin };
}