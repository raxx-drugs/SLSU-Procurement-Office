import React, { useEffect, useState } from "react";
import { CircleArrowLeft } from "lucide-react";
import { Link, Navigate } from "react-router-dom"
import { useSelector } from "react-redux";
import { useFetchPPMPById } from "../../hooks/ppmp/FetchPPMPById";

export default function DisplayDetails() {
    const {currentDetails} = useSelector((state) => state.user);//extract the current id (currentDetails.id)
    const [formData, setFormData] = useState({})//store here all the data to be used for edting
    const {ppmpById,refetchPPMPById} = useFetchPPMPById(currentDetails.id);//fetch here the ppmpData to be stored in the formData
     
     // Fetch PPMP data when currentDetails changes
     useEffect(() => {
        if (currentDetails?.id) {
            refetchPPMPById({ ppmpId: currentDetails.id }); // Trigger fetch with currentDetails.id
        }
    }, [currentDetails, refetchPPMPById]);

    useEffect(() => {
        if (ppmpById) {
            setFormData(ppmpById); // Set the fetched PPMP data in formData for editing
            console.log(ppmpById)
        }
    }, [ppmpById]);
    // Handle input change to update formData
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    // Handle change for nested fields like ppmpData (arrays)
    const handleNestedInputChange = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            ppmpData: {
                ...prev.ppmpData,
                [field]: prev.ppmpData[field].map((item, i) => 
                    i === index ? value : item
                ),
            },
        }));
    };

    // Group all ppmpData fields by index
    const renderGroupedFields = () => {
        console.log(formData)
        const maxIndex = Math.max(
            formData.ppmpData?.description?.length || 0,
            formData.ppmpData?.qnty?.length || 0,
            formData.ppmpData?.mode?.length || 0,
            formData.ppmpData?.dateStart?.length || 0,
            formData.ppmpData?.dateEnd?.length || 0,
            formData.ppmpData?.estimatedBudget?.length || 0
        );
        
        return Array.from({ length: maxIndex }, (_, index) => (
            <div key={index} className="border p-4 my-4 rounded-md shadow-sm">
                <h3 className="font-semibold text-gray-700 dark:text-[#fafafa] mb-2">Item {index + 1}</h3>
                
                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#fafafa]">Description</label>
                    <input 
                        type="text"
                        value={formData.ppmpData?.description?.[index] || ''}
                        onChange={(e) => handleNestedInputChange(index, 'description', e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Quantity */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#fafafa]">Quantity</label>
                    <input 
                        type="text"
                        value={formData.ppmpData?.qnty?.[index] || ''}
                        onChange={(e) => handleNestedInputChange(index, 'qnty', e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Mode */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#fafafa]">Mode</label>
                    <input 
                        type="text"
                        value={formData.ppmpData?.mode?.[index] || ''}
                        onChange={(e) => handleNestedInputChange(index, 'mode', e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Date Start */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#fafafa]">Date Start</label>
                    <input 
                        type="date"
                        value={formData.ppmpData?.dateStart?.[index] || ''}
                        onChange={(e) => handleNestedInputChange(index, 'dateStart', e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Date End */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#fafafa]">Date End</label>
                    <input 
                        type="date"
                        value={formData.ppmpData?.dateEnd?.[index] || ''}
                        onChange={(e) => handleNestedInputChange(index, 'dateEnd', e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Estimated Budget */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#fafafa]">Estimated Budget</label>
                    <input 
                        type="number"
                        value={formData.ppmpData?.estimatedBudget?.[index] || ''}
                        onChange={(e) => handleNestedInputChange(index, 'estimatedBudget', e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
        ));
    };
 
    return (
        <div className="h-full flex flex-col">
            <div className="h-full min-h-full flex-grow p-4 md:p-8  relative ">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className={`flex gap-5 items-center `}>
                    <Link to='/file-collection' className="text-gray-600 hover:text-gray-700 cursor-pointer">
                            <CircleArrowLeft />
                        </Link>
                        <div className={` `}>
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa]">Project Details</h1>
                            <p className="text-sm text-gray-500">Manage user roles and access.</p>
                        </div>
                    
                    </div>
                </div>

                {formData ? (
                        <form className="space-y-4">
                            <div className={`grid grid-cols-2 gap-5 `}>
                                <div className={`grid grid-rows-4`}>
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-[#fafafa]">Title</label>
                                        <input 
                                            type="text"
                                            name="title"
                                            value={formData.title || ''}
                                            onChange={handleInputChange}
                                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    {/* Unit */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-[#fafafa]">Unit</label>
                                        <input 
                                            type="text"
                                            name="unit"
                                            value={formData.unit || ''}
                                            onChange={handleInputChange}
                                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    {/* Funding Source */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-[#fafafa]">Funding Source</label>
                                        <input 
                                            type="text"
                                            name="fundingSource"
                                            value={formData.fundingSource || ''}
                                            onChange={handleInputChange}
                                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    {/* Remarks */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-[#fafafa]">Remarks</label>
                                        <textarea
                                            name="remarks"
                                            value={formData.remarks || ''}
                                            onChange={handleInputChange}
                                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    
                                </div>
                                <div className={`grid`}>

                                     {/* File Data */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#fafafa]">File Data</label>
                                <input 
                                    type="text"
                                    name="fileData"
                                    value={formData.fileData || ''}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            
                                    
                                </div>
                            </div>
                            {renderGroupedFields()}
                            
                            
                           
                        </form>
                ) : (
                    <div>No details available</div> // Fallback in case formData is empty or undefined
                )}
            </div>
        </div>
     
    );
}