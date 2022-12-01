import {configureStore} from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: false,
    // authenticationTokenDetails: undefined,  // {token: string, expirt: dt}
    user: undefined, 
    users: [],
    currentPage: 0,
    pagesAvailable: 0,
    rowsPerPage: 25,
    totalRecords: 0,
    roles: [],
    sessions:[]
}


function reducer(state = initialState, action){
    // if(action == "setAuthDetails"){
    //     return {...state, authenticationTokenDetails: {token: action.token, expiry: action.expiry}, isLoggedIn: true };
    // }

    if(action.type === "login"){
        localStorage.setItem('token', JSON.stringify(action.payload.tokenDetails));
        return {...state, isLoggedIn: true, roles: action.payload.tokenDetails.roles, user: action.payload.userDetails}
    }
    if(action.type === "logout") {
        localStorage.setItem('token', JSON.stringify(""));
        return {...state, isLoggedIn: false, roles: [], user: undefined}
    }
    if(action.type === "fetchUsers") {
        return {...state, users: action.payload.users, pagesAvailable: action.payload.pagesAvailable, totalRecords: action.payload.totalRecords}
    }
    if(action.type === "updatePage"){
        if(action.payload.rowsPerPage){
            return {...state, currentPage: action.payload.newPage, rowsPerPage: action.payload.rowsPerPage}
        }
        return {...state, currentPage: action.payload.newPage}
    }
    if(action.type === "fetchSessions"){
        return {...state, sessions: action.payload.sessions}
    }
    if (action.type === "fetchModules") {
        return {...state, modules: action.payload.modules}
    }
    return state;
}

export const store = configureStore({reducer: reducer});


export const fetchToken = () => {
    return JSON.parse(localStorage.getItem('token'));
}