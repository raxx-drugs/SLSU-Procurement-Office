import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDecryptUserData } from '../user/DecryptUserData';
import { formatDate } from '../../utils/formatDate'; 

export function useFetchPPMP() {
  const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData();
  const [originalPPMP, setOriginalPPMP] = useState([]); // Store the orinal `data` structure array
  const [ppmpData, setPPMPData] = useState([]); // Store the `data` array
  const [count, setCount] = useState(0); // Store the `count` value
  const [countUnit, setCountUnit] = useState(0); // Store the `countUnit` value
  const [totalBudget, setTotalBudget] = useState(0); // Store the `totalBudget` value
  const [entriesThisYear, setEntriesThisYear] = useState([]); // Entries created this year
  const [ppmpRecentEntries, setPpmpRecentEntries] = useState([]); // Store the 5 most recent entries

  const fetchPPMP = useCallback(async () => {
    try {
      if (decryptedData) {
        const currentUnit= decryptedCurrentuser; 
        let url;
        if (decryptedIsUserAdmin) {
          //console.log("Fetching PPMP data for admin");
          url = `/api/paper/ppmp/`; // Admin endpoint
        } else {

          url = `/api/paper/ppmp/unit/${currentUnit}`; // User-specific endpoint
        }
        //console.log(url)
        const response = await axios.get(url);
        //console.log(response);

        // Extract data from the response
        const { count, countUnit, totalBudget, data } = response.data;
        if(!data){
          return;
        }


        const filteredData = data.map((item) => ({
          id:item._id,
          unit: item.unit,
          title:item.title,
          ppmpData: {
            description: item.ppmpData.description,
            qnty: item.ppmpData.qnty,
            mode: item.ppmpData.mode,
            estimatedBudget: item.ppmpData.estimatedBudget,
            dateStart: item.ppmpData.dateStart,
            dateEnd: item.ppmpData.dateEnd,
            prUsed:item.ppmpData.prUsed || false,
     
          },
        }));
        setOriginalPPMP(filteredData);


        // Transform the data to match the new structure
        const transformedData = data.map((item) => {
          const ppmpData = item.ppmpData || {}; // Fallback to an empty object if ppmpData is missing
          return {
            id: item._id,
            type: item.type,
            unit: item.unit || "Unknown Unit",
            title: item.title || "Unknown Unit",
            description: Array.isArray(ppmpData.description) ? ppmpData.description.join(", ") : "N/A",
            quantity: Array.isArray(ppmpData.qnty) ? ppmpData.qnty.join(", ") : "N/A",
            mode: Array.isArray(ppmpData.mode) ? ppmpData.mode.join(", ") : "N/A",
            fundingSource: item.fundingSource || "N/A",
            dateStart: Array.isArray(ppmpData.dateStart)
              ? ppmpData.dateStart.map((date) => formatDate(date)).join(", ")
              : "N/A",
            dateEnd: Array.isArray(ppmpData.dateEnd)
              ? ppmpData.dateEnd.map((date) => formatDate(date)).join(", ")
              : "N/A",
            estimatedBudget: Array.isArray(ppmpData.estimatedBudget)
              ? ppmpData.estimatedBudget.reduce((sum, budget) => sum + budget, 0)
              : 0,
            status: item.status || "N/A",
            remarks: item.remarks || "N/A",
            fileData: item.fileData || "N/A",
            createdAt: formatDate(item.createdAt),
            updatedAt: formatDate(item.updatedAt),
            
          };

          
        });
        

       
        console.log(data[0].ppmpData.length)
        
        // Filter entries created this year
        const currentYear = new Date().getFullYear();
        const thisYearEntries = transformedData.filter(
          (item) => new Date(item.createdAt).getFullYear() === currentYear
        );

        // Get the 5 most recent entries
        const recentData = [...transformedData]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by creation date (descending)
          .slice(0, 5); // Take the first 5 entries

        // Update states
        setPPMPData(transformedData);
        setCount(count);
        setCountUnit(countUnit);
        setTotalBudget(totalBudget);
        setEntriesThisYear(thisYearEntries);
        setPpmpRecentEntries(recentData);
        
      }
    } catch (error) {
      console.error("Error fetching PPMP data:", error.message);
    }
  }, [decryptedData, decryptedIsUserAdmin, decryptedCurrentuser]);

  // Fetch data when the component mounts
  useEffect(() => {
    fetchPPMP();
  }, [fetchPPMP]);

  return { originalPPMP,ppmpData, count, countUnit, totalBudget, entriesThisYear, ppmpRecentEntries, refetchPPMP: fetchPPMP };
}


// Example FileOutput{
//   "id": "12345",
//   "unit": "CIT",
//   "description": "Transcript of Records, Desktop Computers",
//   "quantity": "9200 pcs, 2 sets",
//   "mode": "Transfer of Fund/Bao, Direct Contracting",
//   "dateStart": "01-01-2025, 02-15-2025",
//   "dateEnd": "01-01-2025, 03-15-2025",
//   "estimatedBudget": 30000,
//   "fileData": "https://example.com/file",
//   "createdAt": "2025-01-01",
//   "updatedAt": "2025-01-15"
// }