import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from "react-router-dom";
import { logout, selectAuth, login, checkLogin, regen } from '../store/auth';
import { selectLocalQuizzes, loadLocalQuizzes, deleteLocalQuizzes } from '../store/localQuizzes';
import { clearPrivateQuizzes, selectPrivateQuizzes, uploadLocalQuizzes, retrievePrivateQuizzes } from '../store/privateQuizzes';

export default function AccountBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(selectAuth);
  const localQuizzes = useSelector(selectLocalQuizzes);
  const privateQuizzes = useSelector(selectPrivateQuizzes);


  useEffect(()=>{
    if (localQuizzes.length === 0) {
      dispatch(loadLocalQuizzes());
    }
    if (!auth.login && localStorage.getItem("rememboUsername")) {
      dispatch(checkLogin(localStorage.getItem("rememboUsername")));
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
  
  function handleLogout() {
    //dispatch(clearPrivateQuizzes()); now handled by logout()
    dispatch(logout());
    navigate("/");
  }

  return <div className="AccountBar">
      {auth.login ?
      <div>
        <span id="usernameSpan">{auth.username}</span>
        <button onClick={handleLogout} className="btn">log out</button>
      </div> :
      <div>
        <NavLink className="accountBarLink" to='/login' id="loginButton">log in</NavLink>
        <NavLink className="accountBarLink" to='/register' id="registerButton">register</NavLink>
      </div> }
    </div>;
}