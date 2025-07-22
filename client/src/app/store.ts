import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { usersAPI } from '../features/users/usersAPI'
import { persistReducer, persistStore } from 'redux-persist'              
import storage from 'redux-persist/lib/storage'
import { loginAPI } from '../features/login/loginAPI'
import userSlice from '../features/login/userSlice'

const persistConfig = {
    key: 'root', 
    version: 1,
    storage,
    whitelist: ['user']
}


const rootReducer = combineReducers({
    [usersAPI.reducerPath]: usersAPI.reducer,
    [loginAPI.reducerPath]: loginAPI.reducer,
    // [carAPI.reducerPath]: carAPI.reducer,
    user: userSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer, 

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
        .concat(usersAPI.middleware)
        .concat(loginAPI.middleware)
        // .concat(carAPI.middleware)
})

export const persistedStore = persistStore(store) 
export type RootState = ReturnType<typeof store.getState> 