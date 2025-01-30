import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';
import { persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'// Using localStorage



// Combine all reducers into a rootReducer (currently only user reducer)
const rootReducer = combineReducers({user: userReducer});

// Configuration object for redux-persist
const persistConfig = {
    key: 'root',  // The key under which the persisted data is stored in storage
    version: 1,   // Versioning the persisted state
    storage,      // Storage engine (localStorage in this case)
    whitelist: ['user'], // Ensure the 'user' state is persisted
}

// Creating a persisted reducer using redux-persist
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Creating the Redux store and applying necessary middleware
export const store = configureStore ({
    reducer: persistedReducer, // Using the persisted reducer as the store's main reducer
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware ({
            serializableCheck: false, // Disabling serializable check to allow non-serializable values in actions
        }),

})

// Creating the persistor to persist and rehydrate the store
export const persistor = persistStore(store);