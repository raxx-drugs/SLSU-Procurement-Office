import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure, signInKey } from '../../redux/user/userSlice';
import { generateSecretKey, encryptData, storeSecretKey } from '../../utils/cryptoUtils';


const useGoogleAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [userVerified, setUserVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log(tokenResponse); // Contains the access token and other details

        // Use the access token to get the user's profile information (including email)
        const userInfoResponse = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        const email = userInfoResponse.data.email;
        console.log('Google User Email:', email);

        // Send email to your backend to verify if it's in the database
        const res = await axios.post('/api/auth/google-oauth', { email });

        if (res.data.verified) {
          setIsLogin(true);
          setUserVerified(true);
          setErrorMessage(null);
          // Dispatch action to store encrypted data in Redux
          const secretK = await generateSecretKey(); // Generate a new encryption key
          const encrypted = await encryptData(res.data.user, secretK); // Encrypt data with the key
          dispatch(signInSuccess(encrypted));

          
          const serializedKey = await storeSecretKey(secretK); // Store the key in localStorage

          // Dispatch action to store the encryption key in Redux state
          dispatch(signInKey(serializedKey));
          navigate('/dashboard'); // Redirect to the dashboard after successful sign-in
        } else {
          setIsLogin(true);
          setUserVerified(false);
          console.log('User is not verified');
        }
      } catch (err) {
        setErrorMessage('Error verifying user');
        console.error('Error:', err);
      }
    },
    onError: () => {
      setIsLogin(false);
      setErrorMessage('Login Failed');
      console.log('Login Failed');
    },
  });

  return {
    isLogin,
    userVerified,
    errorMessage,
    login,
  };
};

export default useGoogleAuth;
