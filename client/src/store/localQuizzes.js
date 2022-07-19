import { createSlice } from '@reduxjs/toolkit';

const localQuizzes = createSlice({
  name: "localQuizzes",
  initialState: [],
  reducers: {
    addQuiz:(slice,action)=>{slice.push(action.payload)},
    modifyQuiz:(slice,action)=>{slice[action.payload.index] = action.payload.quiz}
  }
});

export function selectLocalQuizzes(state) {return state.localQuizzes;}
export const { addQuiz, modifyQuiz } = localQuizzes.actions;
export default localQuizzes;