import {configureStore} from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: false,
    // authenticationTokenDetails: undefined,  // {token: string, expirt: dt}
    user: undefined, 
    users: [],
    roles: []
}


function reducer(state = initialState, action){
    // if(action == "setAuthDetails"){
    //     return {...state, authenticationTokenDetails: {token: action.token, expiry: action.expiry}, isLoggedIn: true };
    // }

    if(action.type === "login"){
        localStorage.setItem('token', JSON.stringify(action.payload.tokenDetails));
        return {...state, isLoggedIn: true, roles: action.payload.tokenDetails.roles, user: action.payload.userDetails}
    }
    if(action.type === "fetchUsers") {
        return {...state, isLoggedIn: true, users: action.payload.users}
    }
    return state;
}

export const store = configureStore({reducer: reducer});


export const fetchToken = () => {
    return JSON.parse(localStorage.getItem('token'));
}