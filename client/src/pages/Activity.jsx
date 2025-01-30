import React, { useState, useEffect } from 'react';


import { ArrowLeft, Search, Upload, MessageSquare, Edit, Clock, ThumbsUp, AlertTriangle, ChevronDown, MoreVertical, Filter, Trash2, Eye, Calendar, User } from 'lucide-react';
import { useFetchActivityLog } from '../hooks/activity log/FetchActivityLog.js';
import { useDeleteActivityLog } from '../hooks/activity log/DeleteActivityLog.js';  // Use named import


const iconMap = {
  Edit: Edit,
  Trash2: Trash2,
  Clock: Clock,
  Eye: Eye,
  Upload: Upload,
  MessageSquare: MessageSquare,
  ThumbsUp: ThumbsUp,
  AlertTriangle: AlertTriangle,
  Calendar: Calendar,
  User:User,
  // Add more mappings as needed
};


const Avatar = ({ src, fallback, className }) => (
  <div className={`relative inline-flex h-8 w-8 rounded-full ${className}`}>
    <img src={src || "https://v0.dev/placeholder-user.jpg"} alt="avatar" className="rounded-full object-cover" />
    {!src && <div className="absolute inset-0 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">{fallback}</div>}
  </div>
);

const ActivityItem = ({ avatar, name, action, target, targetType, time, icon: Icon, description, onView, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Use the iconMap to get the appropriate icon component
  const IconComponent = iconMap[Icon] || Clock; // Fallback to Clock if icon not found

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0 px-6">
      <div className={`p-2 rounded-full ${getIconBackground(action)}`}>
        <IconComponent  className={`w-5 h-5 ${getIconColor(action)}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium ">{name}</span>
            <span className="">{action}</span>
            <span className="font-medium text-blue-600 truncate">{target}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className=" hover:text-gray-600"
              aria-label={isExpanded ? "Collapse details" : "Expand details"}
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className=" hover:text-gray-600"
                aria-label="Show options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => { onView(); setShowOptions(false); }}
                      className="block w-full text-left px-4 py-2 text-sm  hover:bg-gray-100"
                    >
                      View
                    </button>
                    <button
                      onClick={() => { onDelete(); setShowOptions(false); }}
                      className="block w-full text-left px-4 py-2 text-sm  hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-sm  mt-1">
          <span>{targetType}</span>
          <span className="mx-2">•</span>
          <span>{time}</span>
        </div>
        {isExpanded && description && <p className="mt-2 text-sm ">{description}</p>}
      </div>
      <Avatar src={avatar} fallback={name[0]} className="flex-shrink-0" />
    </div>
  );
};

const getIconBackground = (action) => {
  switch (action) {
    case 'uploaded': return 'bg-green-100';
    case 'commented on': return 'bg-blue-100';
    case 'updated': return 'bg-yellow-100';
    case 'approved': return 'bg-purple-100';
    case 'flagged': return 'bg-red-100';
    default: return 'bg-gray-100';
  }
};

const getIconColor = (action) => {
  switch (action) {
    case 'uploaded': return 'text-green-600';
    case 'commented on': return 'text-blue-600';
    case 'updated': return 'text-yellow-600';
    case 'approved': return 'text-purple-600';
    case 'flagged': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const RecentActivity = () => {
  const {activityLogList, refetchActivityLog} = useFetchActivityLog();
  const { deleteActivityLog, loading, error } = useDeleteActivityLog();

  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [customDateFilter, setCustomDateFilter] = useState({ start: '', end: '' });
  const [visibleItems, setVisibleItems] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');


  const [activities, setActivities] = useState([]);

  // Populate activities when activityLogList is available
  useEffect(() => {
    if (activityLogList && activityLogList.length > 0 && activities.length === 0) {
      setActivities(activityLogList);
    }
  }, [activityLogList, activities]); // Ensure this runs when activityLogList updates



  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.action === filter;
    const matchesDate = dateFilter === 'all' || checkDateFilter(activity.date, dateFilter, customDateFilter);
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          activity.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          activity.targetType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesDate && matchesSearch;
  });

  const checkDateFilter = (date, filter, customFilter) => {
    const now = new Date();
    switch (filter) {
      case 'today':
        return date.toDateString() === now.toDateString();
      case 'yesterday':
        const yesterday = new Date(now.setDate(now.getDate() - 1));
        return date.toDateString() === yesterday.toDateString();
      case 'thisWeek':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        return date >= weekStart;
      case 'thisMonth':
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      case 'thisYear':
        return date.getFullYear() === now.getFullYear();
      case 'custom':
        const start = new Date(customFilter.start);
        const end = new Date(customFilter.end);
        return date >= start && date <= end;
      default:
        return true;
    }
  };

  const handleLoadMore = () => {
    refetchActivityLog();
    setVisibleItems(prevItems => Math.min(prevItems + 8, filteredActivities.length));
  };

  const handleView = (id) => {
    console.log(`Viewing activity ${id}`);
    // Implement view functionality here
  };

  const handleDelete = async (id) => {
    console.log("Current ID",id)
    await deleteActivityLog(id);
    setActivities(activities.filter(activity => activity.id !== id));
  };

  return (
    <div className="overflow-hidden full">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] flex items-center gap-2"> <Clock className="w-5 h-5 text-blue-600" />Recent Activity</h1>
              <p className="text-sm text-gray-500">Lists of recents actions.</p>
            </div>

          </div>
        <div className="flex gap-4 flex-wrap">
          <div className="relative">
            <input
              type="text"
              placeholder="Search activities..."
              className="appearance-none bg-white dark:bg-[#3B3D3E] border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search activities"
            />
            <Search className="w-4 h-4  absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          {/* <div className="relative">
            <select
              className="appearance-none bg-white dark:bg-[#3B3D3E] border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter activities"
            >
              <option value="all">All Activities</option>
              <option value="uploaded">Uploads</option>
              <option value="commented on">Comments</option>
              <option value="updated">Updates</option>
              <option value="approved">Approvals</option>
              <option value="flagged">Flags</option>
            </select>
            <Filter className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              className="appearance-none bg-white dark:bg-[#3B3D3E] border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              aria-label="Filter by date"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="thisYear">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <Calendar className="w-4 h-4  absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          {dateFilter === 'custom' && (
            <div className="flex gap-2">
              <input
                type="date"
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={customDateFilter.start}
                onChange={(e) => setCustomDateFilter({...customDateFilter, start: e.target.value})}
                aria-label="Start date"
              />
              <input
                type="date"
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={customDateFilter.end}
                onChange={(e) => setCustomDateFilter({...customDateFilter, end: e.target.value})}
                aria-label="End date"
              />
            </div>
          )} */}
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {filteredActivities.slice(0, visibleItems).map((activity) => (
          <ActivityItem
            key={activity.id}
            {...activity}
            onView={() => handleView(activity.id)}
            onDelete={() => handleDelete(activity.id)}
          />
        ))}
      </div>
      {visibleItems < filteredActivities.length && (
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleLoadMore}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium  bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

const Activity = () => {
  
  return (
    <div className={`w-full h-full flex-col gap-5 relative p-4`}>
          <RecentActivity />
    </div>
  );
};

export default Activity;

