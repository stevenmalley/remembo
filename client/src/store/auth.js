import { createSlice } from '@reduxjs/toolkit';
import fetcher from '../fetcher';

const auth = createSlice({
  name: "auth",
  initialState: {login:false},
  reducers: {
    login:(slice,action)=>{
      localStorage.setItem("rememoUsername",action.payload);
      return {login:true,username:action.payload};
    },
    logout:(slice,action)=>{
      localStorage.removeItem("rememoUsername");
      return {login:false}
    }
  }
});


export function login(username,password) {
  return async (dispatch, getState) => {
    const response = await fetcher("/login",
      {method: "POST", credentials:"include", headers: {"Content-Type":"application/json", "Connection": "keep-alive"}, body:JSON.stringify({username,password})});
    const jsonResponse = await response.json();
    if (jsonResponse.message === "AUTHENTICATED") {
      dispatch({type:"auth/login",payload:jsonResponse.username});
    } else {
      dispatch({type:"auth/logout"});
    }
  }
}

export function checkLogin(username) {
  return async (dispatch, getState) => {
    const response = await fetcher("/checkLogin",
      {method: "POST", credentials:"include", headers: {"Content-Type":"application/json", "Connection": "keep-alive"}, body:JSON.stringify({username})});
    const jsonResponse = await response.json();
    if (jsonResponse.message === "AUTHENTICATED") {
      dispatch({type:"auth/login",payload:jsonResponse.username});
    } else {
      dispatch({type:"auth/logout"});
    }
    return jsonResponse;
  }
}

export function register(username,password) {
  return async (dispatch, getState) => {
    const response = await fetcher("/register",
      {method: "POST", credentials:"include", headers: {"Content-Type":"application/json", "Connection": "keep-alive"}, body:JSON.stringify({username,password})});
    const jsonResponse = await response.json();
    if (jsonResponse.message === "AUTHENTICATED") {
      dispatch({type:"auth/login",payload:jsonResponse.username});
    } else {
      dispatch({type:"auth/logout"});
    }
  }
}

export function logout() {
  return async (dispatch, getState) => {
    await fetcher("/logout",
      {method: "GET", credentials:"include", headers: {"Content-Type":"application/json", "Connection": "keep-alive"}});
    dispatch({type:"auth/logout"});
  }
}

export function regen() {
  return async (dispatch, getState) => {
    return await fetcher("/regen",
      {method: "POST", credentials:"include", headers: {"Content-Type":"application/json", "Connection": "keep-alive"}});
  }
}


export function selectAuth(state) {return state.auth;}
export default auth;