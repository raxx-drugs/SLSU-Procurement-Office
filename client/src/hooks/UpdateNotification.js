import { useState, useEffect } from 'react';
import axios from 'axios';

export function useUpdateNotification() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateNotification = async (id) => {
        try {
            if(!id){
                alert('Invalid Request')
                return;
            }
            console.log(id)
            console.log("Current Id2 : ",id);
            const response = await axios.put(`/api/paper/notification/read/unit/${id}`);
        } catch (error) {
            setError(error.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    

    return { updateNotification, loading, error };
}

export default useUpdateNotification;

