import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/auth';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(login(e.target.username.value,e.target.password.value));
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit}>
    <label htmlFor="username">USERNAME: </label><input type="text" name="username" id="username" />
    <br />
    <label htmlFor="password">PASSWORD: </label><input type="text" name="password" id="password" />
    <br />
    <input type="submit" value="OK" />
    </form>
  )
}