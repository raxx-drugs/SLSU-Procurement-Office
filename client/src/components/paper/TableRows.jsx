import React, { useState } from "react"
import PropTypes from "prop-types"
import { Power, Edit, Trash, Eye, EyeOff } from "lucide-react"
import { getTagColor } from "../../utils/tagColors"
import { Link } from "react-router-dom"
import {setCurrentDetails} from '../../redux/user/userSlice.js'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


export const TableRows= React.memo(({ data, isSelected, onSelect, onActivate, onDelete, onEdit, handleViewPDF, handleViewDetails}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleView = (datas) => {
        if(datas){
            dispatch(setCurrentDetails(datas));
            console.log(datas)
            if(datas.type ==='PPMP'){
                navigate('/file-collection/details')
            }
            if(datas.type ==='Purchase Request'){
                navigate('/pr-monitor/details')
            }
            
        }
    }
  return (
    <>{data ? ( 
      <tr className="border-b last:border-b-0 dark:border-gray-500  hover:bg-gray-50 dark:hover:bg-gray-800 relative">
        <td className="px-4 py-3">
            <input
            type="checkbox"
            className="rounded border-gray-300 dark:border-gray-500 text-green-600 focus:ring-green-500"
            checked={isSelected}
            onChange={() => onSelect(data.id)}
            />
        </td>
        <td className="px-4 py-3">
            <button className={`cursor-pointer text-slate-600 dark:text-[#fafafa]`} onClick={() => handleViewPDF(data.fileData)}><Eye className={`h-4 `}/></button>
        </td>
        <td className="px-4 py-3">
            <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600 ">
                {data.unit
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
            </div>
            <div>
                <div className="text-sm font-medium text-gray-900 dark:text-[#fafafa]">{data.unit}</div>
            </div>
            </div>
        </td>

        {data.prNo && 
        <td className="px-4 py-3">
            <div className="text-xs text-gray-500 dark:text-[#fafafa]">{data.prNo}</div>
        </td>
        }


        
        <td className="px-4 py-3">
            <div className="text-xs text-gray-500 dark:text-[#fafafa]">{data.type}</div>
        </td>
        <td className="px-4 py-3">
            <div className="text-xs text-gray-500 dark:text-[#fafafa]">{data.title}</div>
        </td>
        <td className="px-4 py-3">
            <div className="text-xs text-gray-500">
                <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        data.status === "Done"
                        ? "bg-green-50 text-green-700"
                        : data.status === "In Progress"
                        ? "bg-blue-50 text-blue-700"
                        : data.status === "Pending"
                        ? "bg-orange-50 text-orange-700"
                        : "bg-red-50 text-red-700"
                    }`}
                    >
                    <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 
                        ${data.status === "Done" ? "bg-green-600" 
                        : data.status === "In Progress" ? "bg-blue-500" 
                        : data.status === "Pending" ? "bg-orange-500" 
                        : "bg-red-500"}`} // Default for other statuses like "Delayed"
                    ></span>
                    {data.status}
                </span>
            </div>
        </td>
        <td className="px-4 py-3">
            <div className="text-xs text-gray-500 dark:text-[#fafafa]">{data.updatedAt}</div>
        </td>
        <td className="px-4 py-3">
            <div className="text-xs text-gray-500 dark:text-[#fafafa]">{data.remarks}</div>
        </td>

        <td className="px-4 py-3">
            <div className="flex items-center gap-2">
                <button onClick={() => handleView(data)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-blue-500" />
                </button>
         
            </div>
        </td>
    </tr>):(
        <tr className="h-full border-b last:border-b-0 dark:border-gray-500  hover:bg-gray-50 relative">
             <td className="px-4 py-3">  
       
            </td>
        </tr>
    )}
    </>
  
   )
})
TableRows.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    unit: PropTypes.string,
    title: PropTypes.string,
    fundingSource: PropTypes.string,
    description: PropTypes.string,
    quantity: PropTypes.string,
    estimatedBudget: PropTypes.number,
    dateStart: PropTypes.string,
    dateEnd: PropTypes.string,
    status: PropTypes.string,
    remarks: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  onActivate: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
}
