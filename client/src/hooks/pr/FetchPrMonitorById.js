import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDecryptUserData } from '../user/DecryptUserData';
import { useSelector } from 'react-redux';

export function useFetchPrById() {
    const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData();
    const [prById, setPrById] = useState();
    const {currentPrDetails} = useSelector((state) => state.user);
   

    const fetchPrById = useCallback(async ({prId} = {}) => {
      try {
        if(!prId){
            prId=currentPrDetails;
        }
        let url;
        if(prId){
          console.log(prId)
            url = `/api/paper/pr/${prId}`; // Fetch specific PR
            const response = await axios.get(url);
            if (response?.data) {
              setPrById(response.data);  // Extract user data from response
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
        fetchPrById();
    }, [fetchPrById]);

  return { prById, refetchPrById: fetchPrById };
}


// Example Usage in a Component:
// const { prList, loading, error, refetchPr } = useFetchPr();

// // Example rendering
// if (loading) {
//     return <p>Loading...</p>;
// }

// if (error) {
//     return <p>Error: {error}</p>;
// }

// return (
//     <div>
//         <h2>Purchase Requests</h2>
//         {prList.length === 0 ? (
//             <p>No PRs found.</p>
//         ) : (
//             <ul>
//                 {prList.map((pr) => (
//                     <li key={pr._id}>{pr.title}</li>
//                 ))}
//             </ul>
//         )}
//     </div>
// );
