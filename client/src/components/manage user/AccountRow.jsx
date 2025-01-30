import React, { useState } from "react"
import PropTypes from "prop-types"
import { Power, Edit, Trash, Eye, EyeOff } from "lucide-react"
import { getTagColor } from "../../utils/tagColors"

export const AccountRow = React.memo(({ account, isSelected, onSelect, onActivate, onDelete, onEdit }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <tr className="border-b last:border-b-0 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-[#3B3D3E]">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          className="rounded border-gray-300 dark:border-gray-500 text-green-600 focus:ring-green-500"
          checked={isSelected}
          onChange={() => onSelect(account.id)}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600 ">
              {account.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-[#fafafa]">{account.name}</div>
            <div className="text-xs text-gray-500">{account.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            account.status === "Admin" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${account.status === "Admin" ? "bg-green-600" : "bg-red-600"}`}
          ></span>
          {account.status}
        </span>
      </td>

      
      <td className="px-4 py-3 text-sm text-gray-500 dark:text-[#fafafa]">{account.lastLogin}</td>
      <td className="px-4 py-3 text-sm text-gray-500 dark:text-[#fafafa]">{account.createdAt}</td>
      <td className="px-4 py-3 text-sm text-gray-500 dark:text-[#fafafa]">{account.updatedAt}</td>
      {/* account.password */}

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {/* <button
            onClick={() => onActivate(account.id)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            title={account.status === "Admin" ? "Deactivate" : "Activate"}
          >
            <Power className={`w-4 h-4 ${account.status === "Admin" ? "text-green-500" : "text-red-500"}`} />
          </button> */}
          <button onClick={() => onEdit(account)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <Edit className="w-4 h-4 text-blue-500" />
          </button>
          {/* <button onClick={() => onDelete(account.id)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <Trash className="w-4 h-4 text-red-500" />
          </button> */}
        </div>
      </td>
    </tr>
  )
})

AccountRow.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["Admin", "Client"]).isRequired,
    updatedAt: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    lastLogin: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onActivate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
}

