import { createSlice } from '@reduxjs/toolkit';
import fetcher from '../fetcher';

const privateQuizzes = createSlice({
  name: "privateQuizzes",
  initialState: [],
  reducers: {
    addQuiz:(slice,action)=>{slice.push(action.payload)},
    modifyQuiz:(slice,action)=>{slice[slice.findIndex(q => q.id === action.payload.id)] = action.payload},
    deleteQuiz:(slice,action)=>{slice.splice(slice.findIndex(q => q.id === action.payload),1)},
    clearPrivateQuizzes:(slice,action)=>[]
  }
});

// when registering or logging in after creating some quizzes, upload them from localStorage to the server
export function uploadLocalQuizzes(username,localQuizzes) {
  return (dispatch,getState) => {
    localQuizzes.forEach(async quiz => {
      quiz.data.owner = username; // replaces "me"
      const response = await fetcher("/quiz",
        {method: "POST", credentials:"include", headers: {"Content-Type":"application/json", "Connection":"keep-alive"}, body:JSON.stringify(quiz)});
      const jsonResponse = await response.json();
      if (jsonResponse.message === "quiz saved") dispatch({type:"privateQuizzes/addQuiz",payload:{id:jsonResponse.quizID,...quiz.data}});
    });
  }
}

export function retrievePrivateQuizzes(username) {
  return async (dispatch,getState) => {
    const response = await fetcher("/privateQuizzes",
      {method: "POST", credentials:"include", headers: {"Content-Type":"application/json", "Connection":"keep-alive"}, body:JSON.stringify({username})});
    const jsonResponse = await response.json();
    jsonResponse.forEach(quizData => {
      if (getState().privateQuizzes.some(pQuiz => pQuiz.id === quizData.id)) console.log("private quiz duplication: "+quizData.id);
      else dispatch({type:"privateQuizzes/addQuiz",payload:quizData});
    });
  }
}

export function addPrivateQuiz(quiz) {
  return async (dispatch, getState) => {
    const response = await fetcher("/quiz",
      {method: "POST", credentials:"include", headers: {"Content-Type":"application/json", "Connection":"keep-alive"}, body:JSON.stringify(quiz)});
    const jsonResponse = await response.json();
    if (jsonResponse.message === "quiz saved") dispatch({type:"privateQuizzes/addQuiz",payload:{...quiz.data,id:jsonResponse.quizID}});
    return jsonResponse.quizID;
  }
}

export function modifyPrivateQuiz(quiz) {
  return async (dispatch, getState) => {
    const response = await fetcher("/quiz/"+quiz.data.id,
      {method: "PUT", credentials:"include", headers: {"Content-Type":"application/json", "Connection":"keep-alive"}, body:JSON.stringify(quiz)});
    const jsonResponse = await response.json();
    if (jsonResponse.message === "quiz modified") dispatch({type:"privateQuizzes/modifyQuiz",payload:quiz.data});
  }
}

export function deletePrivateQuiz(quiz) {
  return async (dispatch, getState) => {
    const response = await fetcher("/quiz/"+quiz.data.id,
      {method: "DELETE", credentials:"include", headers: {"Content-Type":"application/json", "Connection":"keep-alive"}});
    const jsonResponse = await response.json();
    if (jsonResponse.message === "quiz deleted") dispatch({type:"privateQuizzes/deleteQuiz",payload:quiz.data.id});
  }
}

export function publishQuiz(quiz) {
  return async (dispatch, getState) => {
    const response = await fetcher("/publishQuiz/"+quiz.data.id,
      {method: "PUT", credentials:"include", headers: {"Content-Type":"application/json", "Connection":"keep-alive"}});
    const jsonResponse = await response.json();
    if (jsonResponse.message === "quiz published") dispatch({type:"privateQuizzes/deleteQuiz",payload:quiz.data.id});
  }
}

export function unpublishQuiz(quiz) {
  return async (dispatch, getState) => {
    const response = await fetcher("/unpublishQuiz/"+quiz.data.id,
      {method: "PUT", credentials:"include", headers: {"Content-Type":"application/json", "Connection":"keep-alive"}});
    const jsonResponse = await response.json();
    if (jsonResponse.message === "quiz unpublished") dispatch({type:"privateQuizzes/addQuiz",payload:quiz.data});
  }
}

export const { clearPrivateQuizzes } = privateQuizzes.actions;
export function selectPrivateQuizzes(state) {return state.privateQuizzes;}
export default privateQuizzes;