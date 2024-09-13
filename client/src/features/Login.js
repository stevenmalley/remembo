import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/auth';
import './Authorisation.css';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(login(e.target.username.value,e.target.password.value));
    navigate("/");
  }

  return (
    <form className="loginForm" onSubmit={handleSubmit}>
      <h3>log in to your account</h3>
      <input type="text" name="username" id="username" placeholder="username" />
      <br />
      <input type="text" name="password" id="password" placeholder="password" />
      <br />
      <input type="submit" value="OK" className="rememboButton" />
    </form>
  )
}