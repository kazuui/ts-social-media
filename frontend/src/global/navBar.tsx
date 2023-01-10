import React from 'react';
import { Link } from 'react-router-dom';
// import { ReactComponent as SVG } from "../../public/assets/ellipsis-solid.svg"
import { ReactComponent as SVG } from "../assets/ellipsis-solid.svg"

//Components

function NavBar() {
  return (
    <header>
      {/* Might change the brand to image instead - Jia Yi */}
      <SVG/>
      <div className='navbar'>
        <ul>
          <li className='nav-brand'>
            <Link to="/">Title</Link>
          </li>
          <li className='nav-item'>
            <Link className="active" to="/">Hello</Link>
          </li>
          <li className='nav-item'>
            <Link to="/home">Home</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default NavBar;