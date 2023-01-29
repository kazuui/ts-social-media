import React from 'react';
import { Link } from 'react-router-dom';

//Components

function NavBar() {
  return (
    <header>
      {/* Might change the brand to image instead - Jia Yi */}
      <div className='navbar'>
        <ul>
          <li className='nav-brand'>
            <Link to="/">TS</Link>
          </li>
          {/* <li className='nav-item'>
            <Link className="active" to="/">Hello</Link>
          </li> */}
          <li className='nav-item'>
            <Link to="/home">Home</Link>
          </li>
          <li className='nav-item'>
            <Link to="/:id">My Profile</Link>
          </li>
          <li className='nav-item'>
            <Link to="/chat">Chat</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default NavBar;