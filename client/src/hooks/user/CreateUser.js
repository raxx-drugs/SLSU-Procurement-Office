import { useState } from 'react';
import useCreateActivityLog from '../activity log/CreateActivityLog';
import { useDecryptUserData } from '../user/DecryptUserData'; // Import the decryption hook
import axios from 'axios'; // Import axios for making HTTP requests

function useCreateUser() {
    const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData(); // Invoke the hook properly
    const createActivityLog = useCreateActivityLog();

    const createUser = async (formData) => {
        if (!decryptedIsUserAdmin) {
            // If the user is not an admin, we don't proceed
            alert("You do not have permission to add a user.");
            return;
        }

        if (formData) {
            // Correcting the ternary operator in the activity log
            const activityLog = {
                unit: formData.fname,
                action: "Added as Unit user",
                type: "",
                target_type: "User",
                icon: "User",
                status: "Completed",
                description: `${formData.fname} was added as ${formData.isAdmin ? 'Admin' : 'Unit'}`,
            };

            try {
                // Sending request to create a user
                const response = await axios.post('/api/user/', {
                    fname: formData.fname,
                    lname: formData.lname,
                    email: formData.email,
                    password: formData.password,
                    isAdmin: formData.isAdmin
                });
                if(response){
                    
                // If user is created successfully, log the activity
                await createActivityLog({ createActLog: activityLog });

                // Alert on success
                alert("Successfully added a user!");
    
                }

            } catch (err) {
                // Error handling
                console.error("Error adding user:", err);
                alert("Failed to add user. Please try again.");
            }
        }
    }

    return createUser;
}

export default useCreateUser;
