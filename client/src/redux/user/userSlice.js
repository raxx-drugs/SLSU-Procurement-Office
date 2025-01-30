import {createSlice} from '@reduxjs/toolkit'

// Initial state for the user slice
const initialState = {
    currentUser: null, // Holds the authenticated user data
    secretKey: {}, // Holds the secret key for encryption
    loading: false,    // Indicates whether the sign-in process is ongoing
    error: false,      // Holds error message if sign-in fails
    darkMode: localStorage.getItem('theme') === 'light', // Set the initial theme from localStorage
    currentTaskDetails: null,
    currentPrDetails:null,
    currentPPMPDetails:null,
    currentDetails:null,
    
}

// Creating the user slice using createSlice from Redux Toolkit
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{

        // Action for starting the sign-in process (sets loading to true)
        signInStart: (state) => {
            state.loading = true;
        },
        signInKey: (state, action) => {
            state.secretKey = action.payload;
        },
        // Action for handling successful sign-in (sets user data and resets error/loading states)
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;  // Sets the authenticated user's data
            state.loading = false;               // Stops loading once success occurs
            state.error = false;                 // Resets any error state
        },
        // Action for handling sign-in failure (sets error and stops loading)
        signInFailure: (state, action) => {
            state.loading = false;               // Stops loading on failure
            state.error = action.payload;        // Stores the error message
        },
        // Action for signing out (clears the current user and resets error state)
        signOut: (state) => {
            state.currentUser = null;
            state.secretKey = {};
            state.error = null;
            state.loading = false;
            localStorage.removeItem('secretKey'); // Clear key on sign out
            state.currentTaskDetails = null;
        },
        toggleDarkMode: (state) => {
        state.darkMode = !state.darkMode;
        // Persist dark mode to localStorage
        localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
        },

        setCurrentDetails: (state, action) => {
            state.currentDetails = action.payload;
        },
        setCurrentPrDetails: (state, action) => {
            state.currentPrDetails = action.payload;
        },
        setCurrentPPPMDetails: (state, action) => {
            state.currentPPMPDetails = action.payload;
        },
    }
});

export const {
                signInStart, 
                signInKey, 
                signInSuccess, 
                signInFailure, 
                signOut, 

                //for darkmode
                toggleDarkMode,

                //Task - set task details
                setCurrentDetails,
            
                //Pr monitor
                setCurrentPrDetails,

                setCurrentPPPMDetails
            } = userSlice.actions;

             
export default userSlice.reducer;