import React from 'react';
import useGoogleAuth from '../../hooks/user/GoogleAuth.js';
import google from '../../assets/google.svg';

export default function GoogleOauth() {
  const { isLogin, userVerified, errorMessage, login } = useGoogleAuth();

  return (
    <>
    <div className="xxs:bg-gray-600 lg:bg-gray-300 lg:text-gray-900 flex flex-col rounded-full">
      <button className="p-4 rounded-lg flex items-center justify-center gap-2" onClick={login}>
        <img src={google} alt="" className='size-7'/>
        Sign in with Google 
      </button>

      <div className=" "></div>

      {isLogin && (
        <div>
          {userVerified ? (
            <div>Login Success ✅</div>
          ) : (
            <div>User is not verified ❌</div>
          )}
        </div>
      )}
      
      {errorMessage && <div>{errorMessage}</div>}
    </div>
    </>
  );
}
