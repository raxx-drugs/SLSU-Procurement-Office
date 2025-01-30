import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDecryptUserData } from '../user/DecryptUserData';
import { formatDate } from '../../utils/formatDate'; // Example import (adjust path accordingly)
export function useFetchPR() {
  const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData();

  const [prData, setPRData] = useState([]); // Store the `data` array
  const [prCount, setCount] = useState(0); // Store the `count` value
  const [prCountUnit, setCountUnit] = useState(0); // Store the `countUnit` value
  const [prTotalABC, setTotalABC] = useState(0); // Store the `totalABC` value
  const [prEntriesThisYear, setEntriesThisYear] = useState([]); // Entries created this year
  const [prRecentUploads, setPrRecentUploads] = useState([]); // Store the 5 most recent PR uploads


  const fetchPR = useCallback(async () => {
    try {
      if (decryptedData) {
        const currentUnit= decryptedCurrentuser; 
        let url;
        if (decryptedIsUserAdmin) {
         // console.log("Fetching PR data for admin");
          url = `/api/paper/pr/`; // Admin endpoint
        } else {
          url = `/api/paper/pr/unit/${currentUnit}`; // User-specific endpoint
        }

        //console.log("Fetching from URL:", url);

        const response = await axios.get(url);

        //console.log("Response:", response.data);

        // Extract data from the response
        const { count = 0, countUnit = 0, totalABC = 0, data = [] } = response.data || {};
        console.log(data)
  
        // Transform the data if needed
        const transformedData = (data || []).map((item) => ({
          type: item.type,
          id: item._id,
          fileData: item._fileData,
          prNo: item._pr_no,
          poNo: item._po_no,
          title: item._title,
          abc: item._abc,
          fundSource: item._fund_source,
          unit: item._unit || currentUnit,
          mode: item._mode,
          approvedPR: formatDate(item._date_approved_pr),
          preparedResolution: formatDate(item._date_prepared_resolution),
          resolutionSigned: formatDate(item._date_resolution_signed),
          posting: formatDate(item._date_posting),
          startCanvas: formatDate(item._date_start_canvas),
          finishedCanvas: formatDate(item._date_finished_canvas),
          preparedAbstract: formatDate(item._date_prepare_abstract),
          completionAbstract: formatDate(item._date_completion_abstract),
          swornAffidavit: formatDate(item._date_sworn_affidavit),
          preparedPO: formatDate(item._date_prepared_po),
          approvalPO: formatDate(item._date_approval_po),
          servingPO: formatDate(item._date_serving_po),
          conformedSupplierPO: formatDate(item._date_conformed_supplier_po),
          postingAward: formatDate(item._date_posting_award),
          delivered: formatDate(item._date_delivered),
          supply: formatDate(item._date_supply),
          status: item._status,
          remarks: item._remarks,
          remarksAction: item._remarks_action,
          image: item._image,
          createdAt: formatDate(item.createdAt),
          updatedAt: formatDate(item.updatedAt),
        }));


        // Filter entries created this year
        const currentYear = new Date().getFullYear();
        const thisYearEntries = transformedData.filter(
          (item) => new Date(item.createdAt).getFullYear() === currentYear
        );
        // Get the 5 most recent PR uploads based on createdAt date
        const recentUploads = transformedData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Ensure dates are parsed correctly
          .slice(0, 5); // Get the top 5

        // Update states
        setPRData(transformedData);
        setCount(count);
        setCountUnit(countUnit);
        setTotalABC(totalABC);
        setEntriesThisYear(thisYearEntries);
        setPrRecentUploads(recentUploads);
      }
    } catch (error) {
      console.error("Error fetching PR data:", error.message);
    }
  }, [decryptedData, decryptedIsUserAdmin, decryptedCurrentuser]);

  // Fetch data when the component mounts
  useEffect(() => {
    fetchPR();
  }, [fetchPR]);

  return { prData, prCount, prCountUnit, prTotalABC, prEntriesThisYear, prRecentUploads,  refetchPR: fetchPR };
}
