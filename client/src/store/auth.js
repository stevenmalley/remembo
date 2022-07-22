import { createSlice } from '@reduxjs/toolkit';
import fetcher from '../fetcher';

const auth = createSlice({
  name: "auth",
  initialState: {login:false},
  reducers: {
    login:(slice,action)=>action.payload,
    logout:(slice,action)=>({login:false})
  }
});


export function login(username,password) {
  return async (dispatch, getState) => {
    const response = await fetcher("/login",
      {method: "POST", credentials:"include", headers: {"Content-Type":"application/json", "Connection": "keep-alive"}, body:JSON.stringify({username,password})});
    const jsonResponse = await response.json();
    if (jsonResponse.message === "AUTHENTICATED") dispatch({type:"auth/login",payload:{login:true,username:jsonResponse.username}});
  }
}

export function register(username,password) {
  return async (dispatch, getState) => {
    const response = await fetcher("/register",
      {method: "POST", credentials:"include", headers: {"Content-Type":"application/json", "Connection": "keep-alive"}, body:JSON.stringify({username,password})});
    const jsonResponse = await response.json();
    if (jsonResponse.message === "AUTHENTICATED") dispatch({type:"auth/login",payload:{login:true,username:jsonResponse.username}});
  }
}

export function logout() {
  return async (dispatch, getState) => {
    await fetcher("/logout");
    dispatch({type:"auth/logout"});
  }
}


export function selectAuth(state) {return state.auth;}
export default auth;