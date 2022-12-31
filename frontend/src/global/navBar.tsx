import React from 'react';
import { Link } from 'react-router-dom';

//Components

function NavBar() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Hello</Link>
        </li>
        <li>
          <Link to="/home">Home</Link>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;