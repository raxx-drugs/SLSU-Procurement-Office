import { Search, Plus,  CircleX, Pencil, Filter, ChevronLeft, ChevronRight, Trash, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddFile from "../components/paper/AddFile";
export default function AddEntry() {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const handleEditSave = () =>{
        setIsEditing(!isEditing);

    }
  return (
    
        <div className="flex-grow  relative ">
            {/* Main Content */}
            <div className="w-full h-full grid rounded-xl overflow-hidden shadow-sm">
                    <AddFile/>
            </div>
       
      </div>
 
  )
}

// {/* Header */}
// <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
// <div>
// <h1 className="text-2xl font-semibold text-gray-900">PPMP Dashboard</h1>
// <p className="text-sm text-gray-500">Collection of all PPMP files</p>
// </div>
// <button
//     onClick={handleEditSave}
//     className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white
//         ${isEditing ? 'bg-red-600 hover:bg-red-700':'bg-green-600 hover:bg-green-700'}   transition-colors`}
// >
// {isEditing ? 
//     (<><CircleX className="w-4 h-4 mr-2" />Cancel</>)
//     : (<><Pencil className="w-4 h-4 mr-2" />Edit</>)}
// </button>

// </div>