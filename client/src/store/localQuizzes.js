import { createSlice } from '@reduxjs/toolkit';

const localQuizzes = createSlice({
  name: "localQuizzes",
  initialState: [],
  reducers: {
    addQuiz:(slice,action)=>{slice.push(action.payload)},
    modifyQuiz:(slice,action)=>{slice[action.payload.index] = action.payload.quiz},
    deleteQuiz:(slice,action)=>{slice.splice(action.payload,1)},
    loadLocalQuizzes:(slice,action)=>{
      const localStorageQuizzes = JSON.parse(localStorage.getItem("localQuizzes"));
      if (localStorageQuizzes) {
        return localStorageQuizzes;
      } else localStorage.setItem("localQuizzes","[]");
    }
  }
});


export function addQuiz(quiz) {
  return async (dispatch, getState) => {
    const localStorageQuizzes = JSON.parse(localStorage.getItem("localQuizzes"));
    if (localStorageQuizzes) {
      localStorageQuizzes.push(quiz);
      localStorage.setItem("localQuizzes",JSON.stringify(localStorageQuizzes));
    } else localStorage.setItem("localQuizzes",JSON.stringify([quiz]));

    dispatch({type:"localQuizzes/addQuiz",payload:quiz});
  }
}

export function modifyQuiz(payload) { // receives {index,quiz}
  return async (dispatch, getState) => {
    const localStorageQuizzes = JSON.parse(localStorage.getItem("localQuizzes"));
    if (localStorageQuizzes) {
      localStorageQuizzes[payload.index] = payload.quiz;
      localStorage.setItem("localQuizzes",JSON.stringify(localStorageQuizzes));
    } else console.log("local storage inconsistency");

    dispatch({type:"localQuizzes/modifyQuiz",payload:payload});
  }
}

export function deleteQuiz(index) {
  return async (dispatch, getState) => {
    const localStorageQuizzes = JSON.parse(localStorage.getItem("localQuizzes"));
    if (localStorageQuizzes) {
      localStorageQuizzes.splice(index,1);
      localStorage.setItem("localQuizzes",JSON.stringify(localStorageQuizzes));
    } else console.log("local storage inconsistency");

    dispatch({type:"localQuizzes/deleteQuiz",payload:index});
  }
}

export const { loadLocalQuizzes } = localQuizzes.actions;
export function selectLocalQuizzes(state) {return state.localQuizzes;}
export default localQuizzes;