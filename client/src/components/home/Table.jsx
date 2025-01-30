import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Edit, Trash2, Eye, Plus } from 'lucide-react';

const initialData = [
  {
    id: 4,
    file: "example.com/image",
    title: "Procurement of computer",
    sof: "School funds",
    unit: "CEN",
    type: "Purchase Request",
    status: "Done",
    dateStart: "2024-12-02",
    dateEnd: "2/10/2025",
    lastModified: "1/19/2025"
  },
  {
    id: 5,
    file: "example.com/image",
    title: "Procurement of computer",
    sof: "School funds",
    unit: "CABHA",
    type: "Purchase Request",
    status: "Done",
    dateStart: "2024-12-02",
    dateEnd: "2/10/2025",
    lastModified: "1/18/2025"
  },
  {
    id: 6,
    file: "example.com/image",
    title: "Procurement of computer",
    sof: "School funds",
    unit: "CIT",
    type: "Quotation",
    status: "Done",
    dateStart: "2024-12-02",
    dateEnd: "2/10/2025",
    lastModified: "1/18/2025"
  },
  {
    id: 7,
    file: "example.com/image",
    title: "Procurement of computer",
    sof: "School funds",
    unit: "CIT",
    type: "Purchase Request",
    status: "Done",
    dateStart: "2024-12-02",
    dateEnd: "2/10/2025",
    lastModified: "1/18/2025"
  },
  {
    id: 8,
    file: "example.com/image",
    title: "Procurement of computer",
    sof: "School funds",
    unit: "CTE",
    type: "Purchase Request",
    status: "Done",
    dateStart: "2024-12-02",
    dateEnd: "2/10/2025",
    lastModified: "1/18/2025"
  },
  {
    id: 2,
    file: "example.com/image",
    title: "Procurement of pc",
    sof: "",
    unit: "CAG",
    type: "Purchase Request",
    status: "Done",
    dateStart: "2024-12-02",
    dateEnd: "2/10/2025",
    lastModified: "1/19/2025"
  },
  {
    id: 3,
    file: "example.com/image",
    title: "Procurement of pc",
    sof: "",
    unit: "CIT",
    type: "Purchase Request",
    status: "Done",
    dateStart: "2024-12-02",
    dateEnd: "2/10/2025",
    lastModified: "1/19/2025"
  },
  {
    id: 1,
    file: "example.com/image",
    title: "asds",
    sof: "",
    unit: "CIT",
    type: "PPMP",
    status: "In Progress",
    dateStart: "01/02/2025",
    dateEnd: "01/10/2025",
    lastModified: "1/19/2025"
  }
];

const ProcurementTable = () => {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filterType, setFilterType] = useState('all');

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  // Handle view
  const handleView = (item) => {
    alert(`Viewing details for item: ${item.title}`);
  };

  // Handle edit
  const handleEdit = (item) => {
    alert(`Editing item: ${item.title}`);
  };

  // Handle add new file
  const handleAddFile = () => {
    alert('Add new file functionality');
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let processedData = [...data];

    // Filter
    if (searchTerm) {
      processedData = processedData.filter(item =>
        Object.values(item).some(val =>
          val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      processedData = processedData.filter(item =>
        item.type.toLowerCase() === filterType.toLowerCase()
      );
    }

    // Sort
    if (sortConfig.key) {
      processedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return processedData;
  }, [data, searchTerm, sortConfig, filterType]);

  return (
    <div className="w-full bg-white p-6">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
          <button className="text-sm font-medium text-gray-900 px-3 py-2 rounded hover:bg-gray-100">
            All Files
          </button>
          <button className="text-sm font-medium text-gray-500 px-3 py-2 rounded hover:bg-gray-100">
            Purchase Request
          </button>
          <button className="text-sm font-medium text-gray-500 px-3 py-2 rounded hover:bg-gray-100">
            Quotation
          </button>
          <button className="text-sm font-medium text-gray-500 px-3 py-2 rounded hover:bg-gray-100">
            PPMP
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search files..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="p-2 border border-gray-200 rounded-md hover:bg-gray-50"
            onClick={() => setFilterType(filterType === 'all' ? 'purchase request' : 'all')}
          >
            <Filter className="h-4 w-4 text-gray-500" />
          </button>
          <button 
            className="p-2 border border-gray-200 rounded-md hover:bg-gray-50"
            onClick={() => handleSort('title')}
          >
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
          </button>
          <button 
            onClick={handleAddFile}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add File
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              {['File', 'Title', 'SoF', 'Unit', 'Type', 'Status', 'Date Start', 'Date End', 'Last Modified', 'Actions'].map((header) => (
                <th
                  key={header}
                  className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(header.toLowerCase().replace(' ', ''))}
                >
                  <div className="flex items-center gap-2">
                    {header}
                    {sortConfig.key === header.toLowerCase().replace(' ', '') && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-900">{item.id}</td>
                <td className="p-4 text-sm text-gray-900">{item.file}</td>
                <td className="p-4 text-sm text-gray-900">{item.title}</td>
                <td className="p-4 text-sm text-gray-500">{item.sof}</td>
                <td className="p-4 text-sm text-gray-900">{item.unit}</td>
                <td className="p-4 text-sm text-gray-900">{item.type}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.status === 'Done' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-900">{item.dateStart}</td>
                <td className="p-4 text-sm text-gray-900">{item.dateEnd}</td>
                <td className="p-4 text-sm text-gray-500">{item.lastModified}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcurementTable;

