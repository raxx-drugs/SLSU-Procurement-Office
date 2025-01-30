import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { retrieveSecretKey, decryptData } from "../../utils/cryptoUtils";

export function useDecryptUserData() {
    const { currentUser, secretKey } = useSelector((state) => state.user);
    const [decryptedData, setDecryptedData] = useState(null);
    const [decryptedCurrentuser, setDecryptedCurrentuser] = useState(null);
    const [decryptedIsUserAdmin, setDecryptedIsUserAdmin] = useState(null);//check if the user is admin or not

    useEffect(() => {
        const retrieveKey = async () => {
            if (!currentUser || !secretKey) {
                console.warn("currentUser or secretKey is missing");
                return;
            }

            try {
                const originalKey = await retrieveSecretKey(secretKey);
                const decrypted = await decryptData(currentUser, originalKey);
                setDecryptedData(decrypted);
                setDecryptedCurrentuser(decrypted.data.fname);
                setDecryptedIsUserAdmin(decrypted.data.isAdmin);
                //console.log(decrypted)
                //console.log("User ID: ",decrypted.data._id)
                //console.log("User Name: ",decrypted.data.fname)
                //console.log("is Admin?: ",decrypted.data.isAdmin)
            } catch (error) {  
                console.error("Error during decryption:", error);
            }
        };

        retrieveKey();
    }, [currentUser, secretKey]);

    return { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin };
}
