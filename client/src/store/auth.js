import { createSlice } from '@reduxjs/toolkit';
import fetcher from '../fetcher';

const auth = createSlice({
  name: "auth",
  initialState: {login:false},
  reducers: {
    login:(slice,action)=>{
      localStorage.setItem("rememboUsername",action.payload);
      return {login:true,username:action.payload};
    },
    logout:(slice,action)=>{
      localStorage.removeItem("rememboUsername");
      return {login:false}
    }
  }
});


export function login(username,password) {
  return async (dispatch, getState) => {
    const response = await fetcher("/login","POST",{username,password});
    const jsonResponse = await response.json();
    if (jsonResponse.message === "AUTHENTICATED") {
      dispatch({type:"auth/login",payload:jsonResponse.username});
    } else {
      dispatch({type:"auth/logout"});
      dispatch({type:"privateQuizzes/clearPrivateQuizzes"});
    }
  }
}

export function checkLogin(username) {
  return async (dispatch, getState) => {
    const response = await fetcher("/checkLogin","POST",{username});
    const jsonResponse = await response.json();
    if (jsonResponse.message === "AUTHENTICATED") {
      dispatch({type:"auth/login",payload:jsonResponse.username});
    } else {
      dispatch({type:"auth/logout"});
      dispatch({type:"privateQuizzes/clearPrivateQuizzes"});
      alert("You have been logged out.");
    }
    return jsonResponse;
  }
}

export function register(username,password) {
  return async (dispatch, getState) => {
    const response = await fetcher("/register","POST",{username,password});
    const jsonResponse = await response.json();
    if (jsonResponse.message === "AUTHENTICATED") {
      dispatch({type:"auth/login",payload:jsonResponse.username});
    } else {
      dispatch({type:"auth/logout"});
      dispatch({type:"privateQuizzes/clearPrivateQuizzes"});
    }
  }
}

export function logout() {
  return async (dispatch, getState) => {
    await fetcher("/logout","GET");
    dispatch({type:"auth/logout"});
    dispatch({type:"privateQuizzes/clearPrivateQuizzes"});
  }
}

export function regen() {
  return async (dispatch, getState) => {
    return await fetcher("/regen","POST");
  }
}


export function selectAuth(state) {return state.auth;}
export default auth;