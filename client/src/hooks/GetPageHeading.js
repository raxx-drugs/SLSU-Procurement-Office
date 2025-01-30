import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
export function useGetPageHeading() {
    const location = useLocation();
  const [activePage, setActivePage] = useState(null);

  useEffect(() => {
    const pageMappings = {
      '/dashboard': 'Dashboard',
      '/add-entry': 'Procure > Add Entry',
      '/file-collection': 'Procure > File Collection',
      '/pr-monitor': 'Procure > PR Monitoring',
      '/manage-user': 'Manage User',
      '/manage-user/add-user': 'Manage User > Add New User ',
      '/task-board': 'Tasks > Task Board',
      '/task-details': 'Tasks > Task Details',
      '/settings/activity-log': 'Settings > Activity Log',
      '/settings/notification': 'Settings > Notification',
      '/settings/account': 'Settings > Account',
      
     
    };
    setActivePage(pageMappings[location.pathname] || null);
  }, [location.pathname]);
    return {activePage};
}
