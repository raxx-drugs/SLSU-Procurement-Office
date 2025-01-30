import React from 'react'

export default function Account() {
  return (
    <div className="h-full flex flex-col dark:text-[#e2e2e2]">
      <div className="flex-grow p-4 md:p-8  relative">
        <div className="w-full mb-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#e2e2e2]">Users Account</h1>
              <p className="text-sm text-gray-500">Manage own account details and settings</p>
            </div>
            {/* <button
              onClick={() => navigate("/add-entry")}
              className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </button> */}
          </div>
      </div>
    </div>
  </div>
  )
}
