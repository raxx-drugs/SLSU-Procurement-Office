import { useState } from 'react';
import axios from 'axios';
export function useUpdatePPMP() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updatePPMP = async (ppmpId, updatedData) => {
        setLoading(true);

        try {
            if (!ppmpId || !updatedData) {
                alert('Invalid Request');
                return;
            }
            console.log("Current Id2: ", ppmpId);
            console.log("Current PPMP: ", updatedData);

            // Send the updated PPMP data (including fundingSource) to the backend
            const response = await axios.put(`/api/paper/ppmp/${ppmpId}`, updatedData);
            
            if (response.data) {
                alert("PPMP Updated Successfully");
            }
        } catch (error) {
            setError(error.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return { updatePPMP, loading, error };
}

export default useUpdatePPMP;


// Example usage in the Componentimport React, { useState } from 'react';
// import { useUpdatePPMP } from '../hooks/useUpdatePPMP';

// function UpdatePPMPForm({ ppmpId, existingData }) {
//     const { updatePPMP, loading, error } = useUpdatePPMP();

//     const [title, setTitle] = useState(existingData.title);
//     const [fundingSource, setFundingSource] = useState(existingData.fundingSource); // Updated to match original data
//     const [description, setDescription] = useState(existingData.ppmpData.description.join(", "));
//     const [quantity, setQuantity] = useState(existingData.ppmpData.qnty.join(", "));
//     const [mode, setMode] = useState(existingData.ppmpData.mode.join(", "));
//     const [estimatedBudget, setEstimatedBudget] = useState(existingData.ppmpData.estimatedBudget.reduce((sum, budget) => sum + budget, 0)); // Sum of estimated budget
//     const [dateStart, setDateStart] = useState(existingData.ppmpData.dateStart.join(", "));
//     const [dateEnd, setDateEnd] = useState(existingData.ppmpData.dateEnd.join(", "));
//     const [remarks, setRemarks] = useState(existingData.remarks);
//     const [fileData, setFileData] = useState(existingData.fileData);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Prepare updated data with the correct structure
//         const updatedData = {
//             title,
//             fundingSource,
//             ppmpData: {
//                 description: description.split(", "), // Convert back to array
//                 qnty: quantity.split(", "),           // Convert back to array
//                 mode: mode.split(", "),               // Convert back to array
//                 estimatedBudget: [estimatedBudget],   // Keep the estimated budget as an array
//                 dateStart: dateStart.split(", "),     // Convert back to array
//                 dateEnd: dateEnd.split(", "),         // Convert back to array
//             },
//             remarks,
//             fileData,
//             status: "Pending", // Status can be changed as needed
//         };

//         await updatePPMP(ppmpId, updatedData);
//     };

//     if (loading) return <p>Updating PPMP...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return (
//         <form onSubmit={handleSubmit}>
//             <label>
//                 Title:
//                 <input 
//                     type="text" 
//                     value={title} 
//                     onChange={(e) => setTitle(e.target.value)} 
//                 />
//             </label>
//             <br />
//             <label>
//                 Funding Source:
//                 <input 
//                     type="text" 
//                     value={fundingSource} 
//                     onChange={(e) => setFundingSource(e.target.value)} 
//                 />
//             </label>
//             <br />
//             <label>
//                 Description:
//                 <input 
//                     type="text" 
//                     value={description} 
//                     onChange={(e) => setDescription(e.target.value)} 
//                 />
//             </label>
//             <br />
//             <label>
//                 Quantity:
//                 <input 
//                     type="text" 
//                     value={quantity} 
//                     onChange={(e) => setQuantity(e.target.value)} 
//                 />
//             </label>
//             <br />
//             <label>
//                 Mode:
//                 <input 
//                     type="text" 
//                     value={mode} 
//                     onChange={(e) => setMode(e.target.value)} 
//                 />
//             </label>
//             <br />
//             <label>
//                 Estimated Budget:
//                 <input 
//                     type="number" 
//                     value={estimatedBudget} 
//                     onChange={(e) => setEstimatedBudget(e.target.value)} 
//                 />
//             </label>
//             <br />
//             <label>
//                 Start Date:
//                 <input 
//                     type="text" 
//                     value={dateStart} 
//                     onChange={(e) => setDateStart(e.target.value)} 
//                 />
//             </label>
//             <br />
//             <label>
//                 End Date:
//                 <input 
//                     type="text" 
//                     value={dateEnd} 
//                     onChange={(e) => setDateEnd(e.target.value)} 
//                 />
//             </label>
//             <br />
//             <label>
//                 Remarks:
//                 <textarea 
//                     value={remarks} 
//                     onChange={(e) => setRemarks(e.target.value)} 
//                 />
//             </label>
//             <br />
//             <label>
//                 File Data (URL):
//                 <input 
//                     type="text" 
//                     value={fileData} 
//                     onChange={(e) => setFileData(e.target.value)} 
//                 />
//             </label>
//             <br />
//             <button type="submit">Update PPMP</button>
//         </form>
//     );
// }

// export default UpdatePPMPForm;
