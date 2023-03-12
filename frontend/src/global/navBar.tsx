import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

//Components


function NavBar() {

  let navigate = useNavigate();

  //Temp
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  const handleLogout = (e) => {
    e.preventDefault()

    setIsLoggedIn(false)
    navigate("/");

    //{{URL}}/users/logout
  }


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

          <li hidden={!isLoggedIn ? true : false} className='nav-item'>
            <Link to="/home">Home</Link>
          </li>
          <li hidden={!isLoggedIn ? true : false} className='nav-item'>
            <Link to="/:id">My Profile</Link>
          </li>
          <li hidden={!isLoggedIn ? true : false} className='nav-item'>
            <Link to="/chat">Chat</Link>
          </li>

          <li hidden={!isLoggedIn ? true : false} className='nav-item'>
            <Link onClick={handleLogout} to="/">Logout</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default NavBar;