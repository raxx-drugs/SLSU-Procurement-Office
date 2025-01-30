import React, { useEffect, useRef, useState } from "react";
import {
  CalendarIcon,
  FileText,
  Upload,
  AlertCircle,
  Check,
  X,
  CircleArrowLeft,
  Loader2,
  DollarSign,
  FileSignature,
  ClipboardList,
} from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import useCreatePPMP from "../../hooks/ppmp/CreatePPMP";
import { useNavigate } from "react-router-dom";
import useCreateActivityLog from "../../hooks/activity log/CreateActivityLog";
import { useDecryptUserData } from "../../hooks/user/DecryptUserData";
import useCreatePR from "../../hooks/pr/CreatePr";
import { useFetchUser } from "../../hooks/user/FetchUser";
import { useFetchPPMP } from "../../hooks/ppmp/FetchPPMP";

const FileInput = ({ label, value, onChange, placeholder, type = "text", required = false, id }) => (
  <div className="space-y-2 flex-grow">
    <label htmlFor={id} className="text-sm font-medium flex items-center">
      {/* Conditionally render icons based on type */}
      {type === "date" ? (
        <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
      ) : (
        <FileText className="mr-2 h-4 w-4 text-blue-500" />
      )}
      {label}
    </label>
    
    {/* Conditionally apply different styles based on type */}
    <input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      className={`h-12 w-full border rounded px-4`}
      required={required}
    />
  </div>
);

const SelectInput = ({ label, value, onChange, options, id, required = false }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium flex items-center">
      <ClipboardList className="mr-2 h-4 w-4 text-blue-500" />
      {label}
    </label>
    <select id={id} value={value} onChange={onChange} required={required} className="h-12 w-full border rounded px-4 dark:bg-[#252728]">
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const AddFile = () => {
  const { decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData();
  const {unitList} = useFetchUser();
  const createActivityLog = useCreateActivityLog();
  const navigate = useNavigate();
  const createPPMP = useCreatePPMP();
  const createPr =useCreatePR();
  const {originalPPMP} = useFetchPPMP();
  console.log("original",originalPPMP || null)


  const [currentType, setCurrentType] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const currentYearMonth = new Date().toISOString().slice(0, 7);
  const [filteredItemList, setFilteredItemList] = useState({
    index:'', item: '',
  });
  const [selectedItem, setSelectedItem] = useState({
    index:[],
    item:[],
  });

  const [formData, setFormData] = useState({
    type: "PPMP",
    unit: unitList,
    title: "",
    fundingSource: "",
    description: [""],
    qnty: [""],
    mode: [""],
    estimatedBudget: [""],
    dateStart: [""],
    dateEnd: [""],
    status: "Pending",
    remarks: "",
    fileData: {},

  });
  const [prFormData, setPrFormData] = useState({
    type: "Purchase Request",
    unit: unitList,
    prNumber: currentYearMonth+"-",
    title: "",
    status: "Pending",
    abc: "",
    fundingSource: "",
    mode: "",
    dateApprovedPR: "",
    remarks: "",
    fileData: {},
  });
  const [createActLog, setCreateActLog] = useState({
    unit: "",
    action: "Upload",
    type: "",
    target_type: "Document",
    icon: "Upload",
    status: "Pending",
    description: "",
  });

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      type: currentType,
    }));
  }, [currentType]);

  useEffect(() => {
    setPrFormData((prevState) => ({
      ...prevState,
      type: currentType,
    }));
  }, [currentType]);


  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handlePPMPChange = (field, index, value) => {
    setFormData((prevState) => {
      const updatedFormData = { ...prevState };
      updatedFormData[field][index] = value;
      return updatedFormData;
    });
  };
  const handlePMPChange = (id, value) => {
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };
  const handlePRChange = (id, value) => {
    setPrFormData((prevState) => ({ ...prevState, [id]: value }));

    // Filter the originalPPMP data by the selected unit
    const selectedUnitData = originalPPMP.find((item) => item.unit === value);
    if (selectedUnitData) {
      setFilteredItemList(selectedUnitData.ppmpData); // Set the ppmpData for the selected unit
    }
  };

  const addPPMPRow = () => {
    setFormData((prevState) => {
      const updatedFormData = { ...prevState };
      Object.keys(updatedFormData).forEach((key) => {
        if (Array.isArray(updatedFormData[key])) {
          updatedFormData[key].push("");
        }
      });
      return updatedFormData;
    });
  };

  const removePPMPRow = (index) => {
    setFormData((prevState) => {
      const updatedFormData = { ...prevState };
      Object.keys(updatedFormData).forEach((key) => {
        if (Array.isArray(updatedFormData[key])) {
          updatedFormData[key].splice(index, 1);
        }
      });
      return updatedFormData;
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        return;
      }
      if(currentType === 'PPMP'){
        setFormData((prevState) => ({ ...prevState, fileData: file }));
    

      }else if(currentType === 'Purchase Request'){
        setPrFormData((prevState) => ({ ...prevState, fileData: file }));

      }
      setError("");
      
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let activityLog = { ...createActLog }; // Start with the existing state of the activity log
      if (currentType === 'PPMP') {
        console.log(formData);
        await createPPMP({ formData });
        
        // Update activity log with the correct values
        activityLog = {
          ...activityLog,
          unit: formData.unit || decryptedCurrentuser, // This should now be set correctly
          type: formData.type, // This should now be set correctly
          description: `PPMP file '${formData.title}' uploaded`,
        };
      } else if (currentType === 'Purchase Request') {
        const response =  await createPr({ prFormData, selectedItem });
        if(response === 1){
          navigate('/pr-monitor');
        }
        // Update activity log with the correct values
        activityLog = {
          ...activityLog,
          unit: prFormData.unit || decryptedCurrentuser, // This should now be set correctly
          type: prFormData.type, // This should now be set correctly
          description: `PR file '${prFormData.title}' uploaded`,
        };
      }
  

  
      // Create the activity log
      const res = await createActivityLog({ createActLog: activityLog });
      
      
      if(currentType === 'PPMP'){
        navigate('/file-collection');
      }else{
        navigate('/pr-monitor');
      }
  
      setIsSubmitting(false);
    } catch (err) {
      setError("Failed to upload file.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCloseView = () => {
    if(currentType === 'PPMP'){
      navigate("/file-collection");
    }else if(currentType === 'Purchase Request'){
      navigate("/pr-monitor");
    }else{
      navigate(-1);
    }
    
  };

  const [selectInput, setSelectedInput] = useState(false);
  const handleSelectedItem = (index, item) =>{
    setSelectedItem((prevState) => {
      // Check if the item already exists in the selectedItem list
      const itemExists = prevState.index.includes(index);
  
      if (itemExists) {
        // If the item exists, remove it
        const updatedIndexes = prevState.index.filter((i) => i !== index);
        const updatedItems = prevState.item.filter((i) => i !== item);
        return { index: updatedIndexes, item: updatedItems };
      } else {
        // If the item doesn't exist, append it
        return {
          ...prevState,
          index: [...prevState.index, index],
          item: [...prevState.item, item],
        };
      }
    });
    // Toggle the checkbox state
  setCheckboxStates((prev) => {
    const newState = [...prev];
    newState[index] = !newState[index]; // Toggle the checkbox for this index
    return newState;
  });
  
    setSelectedInput(true);
    
  }
  console.log(selectedItem)
  const [checkboxStates, setCheckboxStates] = useState([]);
  return (

      <div className="w-full shadow-2xl p-5">
        <div className="flex items-center gap-2">
          <i onClick={handleCloseView} className="text-gray-600 hover:text-gray-700 cursor-pointer">
            <CircleArrowLeft />
          </i>
          <h2 className="text-xl text-gray-700 font-semibold">Procurement Form</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 p-6">
            <SelectInput
              label="File Type"
              value={currentType}
              onChange={(e) => setCurrentType(e.target.value)}
              options={["PPMP", "Purchase Request", "Other"]}
              id="type"
              required
            />
            {currentType === "PPMP" && <div className="grid gap-4">{

              // PPMP start here
            
              <div className={` w-full grid gap-4`}>
              {/* Unit Select dropdown */}
              {decryptedIsUserAdmin &&
              <SelectInput 
                label="Unit" 
                value={formData.unit} 
                onChange={(e) => handlePMPChange(e.target.id, e.target.value)}
                options={unitList.map((user) => user)}  // Ensure you pass a scalar list (e.g., 'fname' or 'id')
                id="unit"
                required 
              />
              }
              <FileInput
                label="Title"
                value={formData.title}
                onChange={handleInputChange}
                id="title"
                placeholder="Enter project title"
                required
              />
              <div className={`w-full  flex gap-2 flex-wrap `}>


              <SelectInput
                  label="Funding Source"
                  value={formData.fundingSource}
                  onChange={handleInputChange}
                  options={["Regular Fund", 
                            "Pre/Speacial Trust Fund",
                            "Income-Generating Project (IGP)",
                            "Extension Campus",
                            "JGE Campus",
                            "Fiduciary Campus",
                            "Custodial Fund (External Funding)",
                            "LGU Fund",
                          ]}
                  id="fundingSource"
                  required
              />
              <FileInput
                label="Funding Source (Optional)"
                value={formData.fundingSource}
                onChange={handleInputChange}
                id="fundingSource"
                placeholder="Only enter the source here if the source is not provided from the list"
                required
              />   
              </div>


              <h3 className="text-lg font-bold">PPMP Details</h3>
              {formData.description.map((_, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-2">
                  <FileInput
                    label="Description"
                    value={formData.description[index]}
                    onChange={(e) => handlePPMPChange("description", index, e.target.value)}
                    required
                  />
                  <FileInput
                    label="Quantity"
                    value={formData.qnty[index]}
                    onChange={(e) => handlePPMPChange("qnty", index, e.target.value)}
                    required
                  />
                  <SelectInput
                  label="Mode of Procurement"
                  value={formData.mode[index]}
                  onChange={(e) => handlePPMPChange("mode", index, e.target.value)}
                  options={["SVP", 
                            "Shopping",
                            "Bidding",
                            "Direct Contracting",
                          ]}
                  required
                />
                  <FileInput
                    label="Estimated Budget"
                    value={formData.estimatedBudget[index]}
                    onChange={(e) => handlePPMPChange("estimatedBudget", index, e.target.value)}
                    required
                    type='number'
                  />
                  <FileInput
                    label="Start Date"
                    value={formData.dateStart[index]}
                    onChange={(e) => handlePPMPChange("dateStart", index, e.target.value)}
                    type="date"
                    required
                  />
                  <FileInput
                    label="End Date"
                    value={formData.dateEnd[index]}
                    onChange={(e) => handlePPMPChange("dateEnd", index, e.target.value)}
                    type="date"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removePPMPRow(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className={`flex w-full justify-center`}>
              <button type="button" onClick={addPPMPRow} className="mt-4 p-4 rounded-md bg-blue-200 text-blue-500 hover:text-blue-700">
                Add Row
              </button>
              </div>
              </div>}
              <FileInput
                label="Remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                id="remarks"
                placeholder="Enter remarks"
              />
              <input 
                type="file" 
                accept='application/pdf' 
                placeholder='Select File' 
                className={`dark:bg-[#333334] p-4 rounded-lg`} 
                onChange={(e) => handleFileUpload(e)}
                />
            </div>}

{/* ===========================================================================================================================================================            */}
            {currentType === "Purchase Request" && <div className="grid gap-4">{
              <div className={` w-full grid gap-4`}>
                {/* Unit Select dropdown */}
                {decryptedIsUserAdmin && 
                  <SelectInput 
                    label="Unit" 
                    value={prFormData.unit} 
                    onChange={(e) => handlePRChange(e.target.id, e.target.value)}
                    options={unitList.map((user) => user)} 
                    id="unit"
                    required 
                  />
                }
                {/*  */}
                <div className={`w-full flex gap-2 text-xs flex-wrap`}>
                  {filteredItemList && filteredItemList.description && filteredItemList.description.length > 0 ? (
                    // Check if there are items that are not yet used (prUsed is false)
                    filteredItemList.description.some((_, index) => !filteredItemList.prUsed[index]) ? (
                      filteredItemList.description.map((_, index) => (
                        // Render only if prUsed is false or undefined
                        !filteredItemList.prUsed[index] && (
                          <div key={index} className={`bg-[#333334] p-5 rounded-2xl cursor-pointer`} onClick={() => handleSelectedItem(index, filteredItemList.description[index])}>
                            <div className={`flex gap-2`}>
                              <input 
                                type="checkbox" 
                                className="" 
                                checked={checkboxStates[index] || false} // Bind checkbox state
                                readOnly 
                              />
                              <span>Item {index + 1}</span>
                            </div>
                            <div className={` `}>Description: {filteredItemList.description[index]}</div>
                            <div className={` `}>Quantity: {filteredItemList.qnty[index]}</div>
                            <div className={` `}>Mode: {filteredItemList.mode[index]}</div>
                            <div className={` `}>Estimated Budget: {filteredItemList.estimatedBudget[index]}</div>
                            <div className={` `}>Date Start: {filteredItemList.dateStart[index]}</div>
                            <div className={` `}>Date End: {filteredItemList.dateEnd[index]}</div>
                            <div className={` `}>{filteredItemList.prUsed[index] ? filteredItemList.prUsed[index] : ''}</div>
                          </div>
                        )
                      ))
                    ) : (
                      // If no items are available (all items have prUsed set to true), display the message
                      <div className={`text-red-400`}>
                       {prFormData.unit && 'No items list from PPMP, submit a PPMP first'} 
                      </div>
                    )
                  ) : (
                    // If description is empty or filteredItemList is invalid, also show the message
                    <div className={`text-red-400`}>
                      {prFormData.unit && 'No items list from PPMP, submit a PPMP first'} 
                    </div>
                  )}
                </div>



              {decryptedIsUserAdmin && 
              <FileInput
                label="PR Number #"
                value={prFormData.prNumber}
                onChange={(e) => handlePRChange(e.target.id, e.target.value)}
                id="prNumber"
                placeholder="Enter pr no#"
                required
              />}
              
              <FileInput
                label="PR Title"
                value={prFormData.title}
                onChange={(e) => handlePRChange(e.target.id, e.target.value)}
                id="title"
                placeholder="Enter pr title"
                required
              />
              {decryptedIsUserAdmin &&
              <SelectInput
                label="Pr Current Status"
                value={prFormData.status}
                onChange={(e) => handlePRChange(e.target.id, e.target.value)}
                options={["Pending", 
                          "In Progress",
                          "Done",
                        ]}
                id="status"
                required
              />}
              <FileInput
                label="Total ABC(PHP)"
                value={prFormData.abc}
                onChange={(e) => handlePRChange(e.target.id, e.target.value)}
                id="abc"
                placeholder="Enter pr abc"
                required
                type='number'
              />
              <div className={`w-full  flex gap-2 flex-wrap `}>


              <SelectInput
                  label="Funding Source"
                  value={prFormData.fundingSource}
                  onChange={(e) => handlePRChange(e.target.id, e.target.value)}
                  options={["Regular Fund", 
                            "Pre/Speacial Trust Fund",
                            "Income-Generating Project (IGP)",
                            "Extension Campus",
                            "JGE Campus",
                            "Fiduciary Campus",
                            "Custodial Fund (External Funding)",
                            "LGU Fund",
                          ]}
                  id="fundingSource"
                  required
              />
              <FileInput
                label="Funding Source (Optional)"
                value={prFormData.fundingSource}
                onChange={handleInputChange}
                id="fundingSource"
                placeholder="Only enter the source here if the source is not provided from the list"
                required
              />   
              </div>
              <SelectInput
                label="Mode of Procurement"
                value={prFormData.mode}
                onChange={(e) => handlePRChange(e.target.id, e.target.value)}
                options={["SVP", 
                          "Shopping",
                          "Bidding",
                          "Direct Contracting",
                        ]}
                id="mode"        
                required
              />
              {decryptedIsUserAdmin &&
              <FileInput
                label="Date Pr Approved"
                value={prFormData.dateApprovedPR}
                onChange={(e) => handlePRChange(e.target.id, e.target.value)}
                id="dateApprovedPR"
                placeholder="Enter date pr approved(Optional)"
                required
                type="date"
              />}
              <FileInput
                label="Additional Description"
                value={prFormData.remarks}
                onChange={(e) => handlePRChange(e.target.id, e.target.value)}
                id="remarks"
                placeholder="Enter addtional description for this pr"
                required
              />
              <input 
                type="file" 
                accept='application/pdf' 
                placeholder='Select File' 
                className={` p-4 rounded-lg dark:bg-[#333334]`} 
                onChange={(e) => handleFileUpload(e)}
                />
              </div>
            
            
            }</div>}
          </div>
          {currentType && 
          <div className="flex justify-end gap-4 border-t bg-blue-50 dark:bg-[#252728] px-6 py-4">
            <button type="button" onClick={handleCloseView} className="h-12 px-6 border rounded">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="h-12 px-6 bg-blue-600 text-white rounded">
              {isSubmitting ? "Saving..." : "Save File"}
            </button>
          </div>
          }
        </form>
      </div>
  
  );
};

export default AddFile;
