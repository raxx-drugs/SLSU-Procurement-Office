import React, { useEffect, useState } from "react";
import {PaperclipIcon, Edit,MapPinned, CircleArrowLeft , Edit3, Save, XCircle, FileText, ClipboardList, Tag, DollarSign, PiggyBank, User, Building, ShoppingCart, Flag, CalendarCheck,Upload,
  } from "lucide-react";
import { Link, Navigate } from "react-router-dom"
import { useSelector } from "react-redux";

import { useFetchPrById } from "../../hooks/pr/FetchPrMonitorById";
import {useUpdatePrMonitor} from "../../hooks/pr/UpdatePrMonitor";
import { useNavigate } from 'react-router-dom';
import { useDecryptUserData } from "../../hooks/user/DecryptUserData";
import { formatDate } from "../../utils/formatDate";
import Mapping from "./Mapping";
// Helper function to format dates to input value (yyyy-MM-dd)
const formatDateToInputValue = (date) => {
    if (!date || date === 'N/A') {
        return ''; // Return empty string for N/A or invalid dates
    }

    // Check if the date is in the format MM/DD/YYYY
    const dateParts = date.split('/');
    if (dateParts.length === 3) {
        const [month, day, year] = dateParts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Check if the date is already in the format YYYY-MM-DD
    const isoDateParts = date.split('-');
    if (isoDateParts.length === 3) {
        const [year, month, day] = isoDateParts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return ''; // Return empty string if the date format is unrecognized
  };
  
  // Helper function to format dates for display (mm/dd/yyyy)
  const formatDateToDisplayValue = (date) => {
    if (!date || date === 'N/A') {
        return '';
      }
    
      const [year, month, day] = date.split('-');
      if (year && month && day) {
        return `${month}/${day}/${year}`;
      }
    
      // Return an empty string if the date is invalid
      return '';
  };
  const DateField = ({ name, label, type = "date", value, onChange, isEditing, comment, icon }) => (
    <div className="mb-4">
      <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
        {icon && <span className="mr-2 text-indigo-500">{icon}</span>}
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={!isEditing}
        className={`w-full p-3 borderrounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500  disabled:text-gray-500
            ${value != '' ? 'border-blue-300 disabled:bg-blue-200':'disabled:bg-gray-100 border-gray-300'} `}
      />
      {comment && <p className="mt-1 text-sm text-gray-500">{comment}</p>}
    </div>
  );
const InputField = ({ name, label, type = "text", value, onChange, isEditing, comment, icon }) => (
    <div className="mb-4">
      <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
        {icon && <span className="mr-2 text-indigo-500">{icon}</span>}
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={!isEditing}
        className={`w-full p-3 borderrounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500  disabled:text-gray-500
            ${value != '' ? 'border-blue-300 disabled:bg-blue-200':'disabled:bg-gray-100 border-gray-300'} `}
      />
      {comment && <p className="mt-1 text-sm text-gray-500">{comment}</p>}
    </div>
  );
  
  const SelectField = ({ name, label, options, value, onChange, isEditing, comment, icon }) => (
    <div className="mb-4">
      <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
        {icon && <span className="mr-2 text-indigo-500">{icon}</span>}
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={!isEditing}
        className={`w-full p-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500  disabled:text-gray-500 
            ${value ? 'border-blue-300 disabled:bg-blue-200':'disabled:bg-gray-100 border-gray-300'} `}
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {comment && <p className="mt-1 text-sm text-gray-500">{comment}</p>}
    </div>
  );

  const Section = ({ title, fields, formData, handleChange, isEditing }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-[#fafafa]">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        {fields.map((field) =>
          field.type === "select" ? (
            <SelectField
              key={field.name}
              {...field}
              value={formData[field.name]}
              onChange={handleChange}
              isEditing={isEditing}
            />
          ) : (
            field.type === "date" ? (
              <DateField
              key={field.name}
              {...field}
              value={formData[field.name]}
              onChange={handleChange}
              isEditing={isEditing}
            />
            ): (
            <InputField
              key={field.name}
              {...field}
              value={formData[field.name]}
              onChange={handleChange}
              isEditing={isEditing}
            />
          )
          )
        )}
      </div>
    </div>
  );

export default function DisplayPrDetails() {
    const { decryptedIsUserAdmin}=useDecryptUserData();
    const navigate = useNavigate();
    const {currentDetails} = useSelector((state) => state.user);
    const {prById, refetchPrById}= useFetchPrById({ prId: currentDetails?.id });
    const [isEditing, setIsEditing] = useState(true);
    const [formData, setFormData] = useState({});
    const [currentPrNoToMap,setCurrentPrNoToMap] = useState(null);
    const [isMapping, setIsMapping] = useState(false);

    const handleMapVIewClose = () =>{
      setIsMapping(!isMapping)
    }

    const handleEdit = () =>{
        setIsEditing(!isEditing);
    }
   

     // Fetch PPMP data when currentDetails changes
     useEffect(() => {
        if (currentDetails?.id) {
            refetchPrById({ prId: currentDetails.id }); // Trigger fetch with currentDetails.id
        }
    }, [currentDetails, refetchPrById]);

    useEffect(() => {
        if (prById) {
            setFormData(prById); // Set the fetched PPMP data in formData for editing
        }
    }, [prById]);
    
    useEffect(() => {
        if(prById){
          setFormData( prById ? {
            prNumber: prById._pr_no|| "",
            poNumber: prById._po_no|| "",
            title: prById._title|| "",
            abc: prById._abc|| "",
            fundingSource: prById._fund_source|| "",
            unit: prById._unit|| "",
            modeOfProcurement: prById._mode|| "",
            dateApprovedPR: formatDateToInputValue(prById._date_approved_pr),
            datePreparedResolution: formatDateToInputValue(prById._date_prepared_resolution),
            dateResolutionSigned: formatDateToInputValue(prById._date_resolution_signed)|| "",
            websitePosting: formatDateToInputValue(prById._date_posting)|| "",
            dateStartedCanvassing: formatDateToInputValue(prById._date_start_canvas)|| "",
            dateFinishedCanvassing: formatDateToInputValue(prById._date_finished_canvas)|| "",
            datePreparationAbstract: formatDateToInputValue(prById._date_prepare_abstract)|| "",
            dateCompletionAbstract: formatDateToInputValue(prById._date_completion_abstract)|| "",
            dateSwornAffidavit: formatDateToInputValue(prById._date_sworn_affidavit)|| "",
            datePreparedPO: formatDateToInputValue(prById._date_prepared_po)|| "",
            dateApprovalPO: formatDateToInputValue(prById._date_approval_po)|| "",
            dateServingPO: formatDateToInputValue(prById._date_serving_po)|| "",
            dateConformedPO: formatDateToInputValue(prById._date_conformed_supplier_po)|| "",
            postingAward: formatDateToInputValue(prById._date_posting_award)|| "",
            dateDelivered: formatDateToInputValue(prById._date_delivered)|| "",
            status: prById._status|| "",
            remarks: prById._remarks|| "",
            lastModified: prById.updatedAt|| "",
            createdAt:prById.createdAt|| "",
          }: defaultState);
        }

        console.log(formData)
        setCurrentPrNoToMap(formData.prNumber);
    },[prById])

    useEffect(() => {
      console.log("FormData updated:", formData);
    }, [formData]);

  
    const handleChange = (e) => {
      const { name, value } = e.target;
      // Apply formatDateToInputValue if the field is a date field
      if (
        name.includes('date')
      ) {
        console.log(name,value)
        const newDate = formatDateToInputValue(value);
        setFormData((prevState) => ({
          ...prevState,
          [name]: newDate,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }

      console.log(formData);
    };
  
  
    const {updatePrMonitor} = useUpdatePrMonitor();
  
    const handleSubmit = async (e) => {
      e.preventDefault();  
      await updatePrMonitor(currentDetails.id, formData);
      console.log("Form Submitted", formData);
      setIsEditing(false);
      navigate('/pr-monitor')
    };
  
    const handleCloseView = () => {
      navigate('/pr-monitor')
    }
    const sections = [
      {
        title: "Basic Information",
        fields: [
          
          { name: "prNumber", label: "PR Number", comment: "*Purchase Request Number", icon: <FileText className="w-5 h-5" /> },
          { name: "poNumber", label: "PO Number", comment: "*Purchase Order Number", icon: <ClipboardList className="w-5 h-5" /> },
          { name: "title", label: "Project Title", comment: "*Title/Particulars of the Project", icon: <Tag className="w-5 h-5" /> },
        ],
      },
      {
        title: "Procurement Details",
        fields: [
          { name: "abc", label: "ABC (PHP)", comment: "*Approved Budget for the Contract", icon: <DollarSign className="w-5 h-5" /> },
          {
            name: "fundingSource",
            label: "Funding Source",
            type: "select",
            options: ["Regular Fund", 
                        "Pre/Speacial Trust Fund",
                        "Income-Generating Project (IGP)",
                        "Extension Campus",
                        "JGE Campus",
                        "Fiduciary Campus",
                        "Custodial Fund (External Funding)",
                        "LGU Fund",],
            comment: "*Source of Funds",
            icon: <PiggyBank className="w-5 h-5" />,
          },
          {
            name: "modeOfProcurement",
            label: "Mode of Procurement",
            type: "select",
            options: ["SVP", "SHOPPING", "BIDDING", "DIRECT CONTRACTING"],
            comment: "*Procurement Method",
            icon: <ShoppingCart className="w-5 h-5" />,
          },
        ],
      },
      {
        title: "Timeline",
        fields: [
          { name: "dateApprovedPR", label: "Date Approved PR", type: "date", comment: "*Date when Purchase Request was Approved", icon: <CalendarCheck className="w-5 h-5" /> },
          { name: "datePreparedResolution", label: "Date Prepared Resolution", type: "date", comment: "*Date of Resolution Preparation", icon: <CalendarCheck className="w-5 h-5" /> },
          { name: "dateResolutionSigned", label: "Date Resolution Signed", type: "date", comment: "*Date when Resolution was Signed by Members", icon: <CalendarCheck className="w-5 h-5" /> },
          { name: "websitePosting", label: "PhilGEPS & SLSU Website Posting", type: "date", comment: "*Date Posted on PhilGEPS and SLSU Website", icon: <CalendarCheck className="w-5 h-5" /> },
          { name: "dateStartedCanvassing", label: "Date Started Canvassing", type: "date", comment: "*Beginning of Canvassing Process", icon: <CalendarCheck className="w-5 h-5" /> },
          { name: "dateFinishedCanvassing", label: "Date Finished Canvassing", type: "date", comment: "*Completion of Canvassing Process", icon: <CalendarCheck className="w-5 h-5" /> },
          { name: "dateSwornAffidavit", label: "Sworn Affidavit Date", type: "date", comment: "*Date of Sworn Affidavit", icon: <CalendarCheck className="w-5 h-5" /> },
          { name: "datePreparedPO", label: "Date Prepared PO", type: "date", comment: "*Purchase Order Preparation Date", icon: <CalendarCheck className="w-5 h-5" /> },
          { name: "dateApprovalPO", label: "Date Approval PO", type: "date", comment: "*Purchase Order Approval Date", icon: <CalendarCheck className="w-5 h-5" /> },
          { name: "dateServingPO", label: "Date Serving PO", type: "date", comment: "*Purchase Order Served to Supplier", icon: <CalendarCheck className="w-5 h-5" /> },
          { name: "dateConformedPO", label: "Date Conformed PO", type: "date", comment: "*Supplier's Confirmation of Purchase Order", icon: <CalendarCheck className="w-5 h-5" /> },
          { name: "dateDelivered", label: "Date Delivered", type: "date", comment: "*Date of Delivery", icon: <CalendarCheck className="w-5 h-5" /> },
        ],
      },
      {
        title: "Status and Remarks",
        fields: [
          {
            name: "status",
            label: "Status",
            type: "select",
            options: ["Pending", "In Progress", "Done"],
            comment: "*Current status of the procurement",
            icon: <Flag className="w-5 h-5" />,
          },
          {
            name: "remarks",
            label: "Remarks",
            comment: "*Additional comments or information about the procurement",
            icon: <FileText className="w-5 h-5" />,
          },
        ],
      },
      {
        title: "Last Modified",
        fields: [
          {
            name: "lastModified",
            label: "Last Modified",
            type: "text",
            comment: "*Date and Time of Last Modification",
            icon: <Edit3 className="w-5 h-5" />,
          },
          {
            name: "createdAt",
            label: "Pr Created",
            type: "text",
            comment: "*Date and Time of Pr Submission",
            icon: <Upload className="w-5 h-5" />,
          },
        ],
      },
    ];
  
    return (
      <div className="w-full shadow-2xl p-2">
      <div className="w-full h-full grid  rounded-xl overflow-hidden shadow-sm">
          <div className={`w-full h-full flex flex-col relative`}>
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
                <div className={`flex items-center `}>
                     <div className={`flex items-center justify-center `}>
                        <i onClick={() => navigate('/pr-monitor')} className="text-gray-600 hover:text-gray-700 cursor-pointer mr-5">
                            <CircleArrowLeft />
                        </i>
                    </div>
                 
                    <h3 className="text-lg font-semibold  flex items-center gap-2">
                        <PaperclipIcon className="w-5 h-5 text-blue-600" />
                        Pr Details
                    </h3>
                  </div>
                    <div className={`flex items-center gap-5`}>
                        <button
                            onClick={      
                              handleMapVIewClose}
                            className={`
                                inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white  transition-colors
                               bg-blue-600 hover:bg-blue-700`}
                        >
                          <MapPinned className="w-4 h-4 mr-2" />Open Timeline

                        </button>
                        {decryptedIsUserAdmin &&
                        <button
                            onClick={handleEdit}
                            className={`
                                inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white  transition-colors
                                ${isEditing ? 'bg-red-600 hover:bg-red-700':'bg-green-600 hover:bg-green-700'}`}
                        >
                            {isEditing  ? (
                                <>
                                    <XCircle className="w-4 h-4 mr-2" />Cancel

                                </>

                            ):(
                                <><Edit3 className="w-4 h-4 mr-2" />Edit</>
                            )}
                            
                        </button>}

                    </div>
                    
                   
              </div>

                {/* Body */}
              <div  className={`h-full w-full p-2  overflow-y-auto`}>

                    <form className="dark:text-[#fafafa] p-8 rounded-md shadow-md  mx-auto">
                        {sections.map((section, index) => (
                        <Section
                            key={index}
                            title={section.title}
                            fields={section.fields}
                            formData={formData}
                            handleChange={handleChange}
                            isEditing={isEditing}
                        />
                        ))}
                        {isEditing && (
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            Save
                        </button>
                        )}
                    </form>              
              </div>
              {isMapping && 
              <div className={`absolute w-full h-full bg-gray-800 `}>
                <Mapping currentPrNoToMap={currentPrNoToMap} handleMapVIewClose={handleMapVIewClose}/>
              </div>}
        </div>
    </div>
</div>
  )
}
