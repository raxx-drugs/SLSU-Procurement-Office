import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../Spinner.jsx';
import useSignIn from '../../hooks/user/Signin.js';
import GoogleOauth from './GoogleOauth.jsx';

const SignInModal = ({ isModalSigninOpen }) => {
  const { loading, error } = useSelector((state) => state.user);
  const { email, setEmail, password, setPassword, handleSubmit } = useSignIn();
  
  // Error states for email and password
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });

  // Validation function for required fields
  const validateForm = () => {
    let isValid = true;
    const errors = { email: '', password: '' };

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    }
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle form submit with validation
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submit behavior
    if (validateForm()) {
      handleSubmit(); // Call the original handleSubmit if validation passes
    }
  };

  return (
    <div className={` h-full w-full flex items-center justify-center lg:text-gray-50`}>
      <div className={` rounded-md flex flex-col xxs:gap-2 lg:gap-10 items-center xxs:px-5 lg:px-10 `}>
        <form onSubmit={handleFormSubmit} className={` flex flex-col gap-5  lg:gap-10  z-20`}>
          {/* Section 1 */}
          <div className={`flex flex-col gap-2`}>
            <h1 className={`w-full font-semibold text-2xl`}>Sign In</h1>
            <h6 className={`w-full text-sm`}>* Accounts are provided by the school</h6>
          </div>

          {/* Section 2 */}
          <div className={`flex flex-wrap xxs:flex-col md:flex-row md:gap-5`}>
            {/* Email section */}
            <div className={`basis-1/3 flex-grow flex flex-col  lg:gap-2`}>
              <label htmlFor="email" className={`text-sm `}>Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state on change
                required
                autoComplete="on"
                placeholder="Enter your email"
                className={`rounded-full placeholder:text-xs p-2 xxs:bg-gray-600 lg:bg-gray-300 lg:text-gray-900`}
              />
              {formErrors.email && <span className="text-red-500 text-sm">{formErrors.email}</span>}
            </div>

            {/* Password section */}
            <div className={`basis-1/3 flex-grow flex flex-col lg:gap-2`}>
              <label htmlFor="password" className={`text-sm `}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state on change
                required
                autoComplete="on"
                placeholder="Enter your password"
                className={`rounded-full placeholder:text-xs p-2 xxs:bg-gray-600 lg:bg-gray-300 lg:text-gray-900`}
              />
              {formErrors.password && <span className="text-red-500 text-sm">{formErrors.password}</span>}
            </div>
          </div>

          


          {/* Section 3 */}
          <div className={`flex items-center flex-col gap-2`}>
            {loading ? (
              <Spinner />
            ) : (
              <button type="submit" className={`w-full h-10 bg-green-800 hover:bg-[#2c6e49] rounded-full`}>
                <span className={`text-white`}>Log In</span>
              </button>
            )}
            <h1 className={`text-red-500 `}>{error}</h1>
          </div>
          <div className={`w-full h-[1px] bg-slate-500 `}></div>
        </form>
        <div className={`w-full `}>
          <GoogleOauth />
        </div>
      </div>
    </div>
  );
};

export default function SignIn() {
  const [isModalSigninOpen, setIsModalSigninOpen] = useState(false);
  const [isModalMenuOpen, setIsModalMenuOpen] = useState(false);

  const handleSignInModal = () => {
    if (isModalMenuOpen) {
      setIsModalMenuOpen(false);
      setIsModalSigninOpen(true);
    } else {
      setIsModalSigninOpen(!isModalSigninOpen);
    }
  };

  return (
    <div className={`h-full w-full`}>
        <SignInModal isModalSigninOpen={isModalSigninOpen} />

    </div>
  );
}
