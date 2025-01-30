import {  useLocation, useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AdminLayout from './layout/AdminLayout'
import MainLayout from './layout/MainLayout';

export default function App() {
  const clientId = import.meta.env.VITE_REACT_CLIENT_ID;

  const { currentUser,   darkMode } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  // List of routes where the Header should not be shown (i.e., private routes)
  const privateRoutes = 
      ['/dashboard',
        '/file-collection',
        '/add-entry',
        '/view-entry',
        '/pr-monitor',
        
        '/file-collection/details', 
        '/pr-monitor/details',
        '/manage-user', 
        '/add-user', 
        '/task-board', 
        '/task-details', 
        '/settings/activity-log',
        '/settings/notification',
        '/settings/account']; 


  // Check if the current route is one of the private routes
  const isPrivateRoute = privateRoutes.some((route) =>
    location.pathname.startsWith(route));

  useEffect(() => {
    if(!currentUser && location.pathname !='/'){
      navigate('/'); // Redirect to the dashboard after successful sign-in
    }
  },[location.pathname])

  return (
    <>
      {clientId && 
      <GoogleOAuthProvider clientId={clientId}>
        {isPrivateRoute && currentUser ? <AdminLayout /> : <MainLayout />}
  
      </GoogleOAuthProvider>
      }
    </>
  )
}
