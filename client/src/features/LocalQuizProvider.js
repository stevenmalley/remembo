import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { selectLocalQuizzes, loadLocalQuizzes, deleteLocalQuizzes } from '../store/localQuizzes';
import { selectPrivateQuizzes, uploadLocalQuizzes, retrievePrivateQuizzes } from '../store/privateQuizzes';
import { selectAuth, checkLogin, regen } from '../store/auth';

/*

checks localStorage for any quizzes (ie those made when not logged in) and saves them to the localQuizzes slice.
upon login:
  posts all localStorage quizzes to the server and deletes from localStorage
  retrieves all private quizzes from the server and saves to the privateQuizzes slice

checks localStorage for username, allowing an active session to be retrieved if the cookie is still active.

this is a separate component so it is always available regardless of which URL is used to enter the app (eg. refreshing the page at "/buildQuiz/local/2" will load the local quizzes)

*/

export default function LocalQuizProvider() {

  const auth = useSelector(selectAuth);
  const localQuizzes = useSelector(selectLocalQuizzes);
  const privateQuizzes = useSelector(selectPrivateQuizzes);

  const dispatch = useDispatch();

  useEffect(()=>{
    if (localQuizzes.length === 0) {
      dispatch(loadLocalQuizzes());
    }
    if (!auth.login && localStorage.getItem("rememoUsername")) {
      dispatch(checkLogin(localStorage.getItem("rememoUsername")));
    }
  },[]);

  useEffect(()=>{
    if (auth.login) {
      const localStorageQuizzes = JSON.parse(localStorage.getItem("localQuizzes"));
      if (localStorageQuizzes.length > 0) {
        dispatch(uploadLocalQuizzes(auth.username,localStorageQuizzes));
        dispatch(deleteLocalQuizzes());
      }
      if (privateQuizzes.length === 0) dispatch(retrievePrivateQuizzes(auth.username));

      // reset session cookie every 3 minutes to remain logged in while browser tab is open
      const regenInterval = setInterval(() => dispatch(regen()), 3*60*1000);
      return () => clearInterval(regenInterval);
    }
  },[auth]);

}