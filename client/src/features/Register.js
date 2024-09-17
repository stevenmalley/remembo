import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../store/auth';
import './Authorisation.css';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(register(e.target.username.value,e.target.password.value));
    navigate("/");
  }

  return (
    <div>
      <form className="loginForm" onSubmit={handleSubmit}>
        <h3>create an account</h3>
        <input type="text" name="username" id="username" placeholder="username" />
        <br />
        <input type="password" name="password" id="password" placeholder="password" />
        <br />
        <input type="submit" value="register" className="rememboButton" />
    </form>
      <div>
        <Link to="/" className="rememboButton">return to list menu</Link>
      </div>
    </div>
  )
}