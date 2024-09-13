import { Link } from 'react-router-dom';
import "./About.css";

export default function About() {
  return (
    <div>
      <p>REMEMbO is a tool that can help you memorise lists of information.</p>
      <p>Create a list, add hints or supplementary information, and test yourself.</p>
      <p>It's a learning tool, not a competition, so you can always click to reveal each item.</p>
      <p>&nbsp;</p>
      <p>You can create lists without logging in, but they will only be saved on your device. Creating an account and logging in will save your lists securely, so you can retrieve them from any device in the future.</p>
      <p>&nbsp;</p>
      <Link to="/" className="aboutLink rememboButton">return</Link>
    </div>
  );
}