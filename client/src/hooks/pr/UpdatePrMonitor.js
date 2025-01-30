import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDecryptUserData } from '../user/DecryptUserData';
import useCreateActivityLog from '../activity log/CreateActivityLog';

export function useUpdatePrMonitor() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {decryptedCurrentuser} =useDecryptUserData();
    const {createActivityLog}=useCreateActivityLog();

    const updatePrMonitor = async (paperId, updatedData) => {
        setLoading(true);
        console.log("Current Id : ",paperId);
        console.log("Current data : ",updatedData);
        try {
            if(!paperId || !updatedData){
                alert('Invalid Request')
                return;
            }
            console.log("Current Id2 : ",paperId);
            const response = await axios.put(`/api/paper/pr/${paperId}`, updatedData);
            if (response.data) {
                const newLog = ({
                    unit:decryptedCurrentuser || "N/A",
                    action:'Update',
                    target:'Purchase Request',
                    target_type:'Document',
                    icon:'Edit',
                    description:'You updated the '+updatedData.unit+'\'s PR',
                    additionalData,
                });
                await createActivityLog({ createActLog: activityLog})
                alert("File Updated Successfully");
            }
        } catch (error) {
            setError(error.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    

    return { updatePrMonitor, loading, error };
}

export default useUpdatePrMonitor;

// Example Usage in a Component:

// import React, { useState } from 'react';
// import { useUpdatePaper } from '../hooks/useUpdatePaper';

// function UpdatePaperForm({ paperId, existingData }) {
//   const { updatePaper, loading, error } = useUpdatePaper();

//   const [prNo, setprNo] = useState(existingData.title);
//   const [title, settitle] = useState(existingData.status);
//   const [abc, setabc] = useState(existingData.dateStart);
//   const [source, setsource] = useState(existingData.dateEnd);
//   const [unit, setunit] = useState(existingData.dateEnd);
//   const [mode, setmode] = useState(existingData.dateEnd);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const updatedData = {
//       prNo: prNo,
//       abc: title,
//       source: abc,
//       unit: unit,
//       mode: mode,
//     };

//     await updatePaper(paperId, updatedData);
//   };

//   if (loading) return <p>Updating paper...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <form onSubmit={handleSubmit}>
//       <label>
//         Title:
//         <input type="text" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} />
//       </label>
//       <br />
//       <label>
//         Status:
//         <select value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)}>
//           <option value="Pending">Pending</option>
//           <option value="In Progress">In Progress</option>
//           <option value="Done">Done</option>
//         </select>
//       </label>
//       <br />
//       <label>
//         Start Date:
//         <input type="date" value={updatedStartDate} onChange={(e) => setUpdatedStartDate(e.target.value)} />
//       </label>
//       <br />
//       <label>
//         End Date:
//         <input type="date" value={updatedEndDate} onChange={(e) => setUpdatedEndDate(e.target.value)} />
//       </label>
//       <br />
//       <button type="submit">Update Paper</button>
//     </form>
//   );
// }

// export default UpdatePaperForm;
