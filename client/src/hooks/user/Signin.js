import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure, signInKey } from '../../redux/user/userSlice';
import { generateSecretKey, encryptData, storeSecretKey } from '../../utils/cryptoUtils';

function useSignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        dispatch(signInStart()); // Dispatch action to start the sign-in process

        try {
            // Send POST request to authenticate user
            const result = await axios.post('/api/auth', { email, password });

            // If authentication is successful, proceed with encryption and key storage
            if (result.status === 200) {
                const secretK = await generateSecretKey(); // Generate a new encryption key
                const encrypted = await encryptData(result, secretK); // Encrypt data with the key

                // Dispatch action to store encrypted data in Redux
                dispatch(signInSuccess(encrypted));

                const serializedKey = await storeSecretKey(secretK); // Store the key in localStorage

                // Dispatch action to store the encryption key in Redux state
                dispatch(signInKey(serializedKey));

                navigate('/dashboard'); // Redirect to the dashboard after successful sign-in
            }
        } catch (err) {
            // Handle error if authentication fails
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred';
            dispatch(signInFailure(errorMessage));
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        handleSubmit,
    };
}


export default useSignIn;

// Example Usage in a Component:
// import React from 'react';
// import { useDispatch } from 'react-redux';
// import useSignIn from '../hooks/useSignIn';

// function SignInForm() {
//   const { email, setEmail, password, setPassword, handleSubmit, error } = useSignIn();

//   return (
//     <form onSubmit={handleSubmit}>
//       <label>
//         Email:
//         <input 
//           type="email" 
//           value={email} 
//           onChange={(e) => setEmail(e.target.value)} 
//         />
//       </label>
//       <br />
//       <label>
//         Password:
//         <input 
//           type="password" 
//           value={password} 
//           onChange={(e) => setPassword(e.target.value)} 
//         />
//       </label>
//       <br />
//       <button type="submit">Sign In</button>

//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </form>
//   );
// }

// export default SignInForm;

