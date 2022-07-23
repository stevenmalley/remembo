import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { logout, selectAuth } from '../store/auth';
import { clearPrivateQuizzes } from '../store/privateQuizzes';


export default function AccountBar() {
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(clearPrivateQuizzes());
    dispatch(logout());
  }

  return auth.login ?
      (<div>
        <span id="usernameSpan">{auth.username}</span>
        <button onClick={handleLogout}>LOG OUT</button>
      </div>) : 
      (<div>
        <NavLink className="accountBarLink" to='/login'>log in</NavLink>
        <NavLink className="accountBarLink" to='/register'>register</NavLink>
      </div>)
}