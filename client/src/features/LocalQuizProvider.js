import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { selectLocalQuizzes, loadLocalQuizzes } from '../store/localQuizzes';

export default function LocalQuizProvider() {

  const localQuizzes = useSelector(selectLocalQuizzes);

  const dispatch = useDispatch();
  useEffect(()=>{
    if (localQuizzes.length === 0) {
      dispatch(loadLocalQuizzes());
    }
  },[]);

}