import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//Components

function Login() {

  let navigate = useNavigate();

  //Login variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Login Alert
  const [loginAlert, setLoginAlert] = useState("");

  const handleLogin = (e) => {
    e.preventDefault()

    fetch("http://localhost:3001/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)

        if (!data.user) {
          setLoginAlert("Username or Password in incorrect!")
        } else {
          navigate("/home");
        }
      })
      .catch((error) => {
        console.log(error)
      });
  }

  return (
    <div className='p-4'>
      <p className='mb-2'>{loginAlert}</p>
      <form className='mb-2' onSubmit={handleLogin}>

        {/* Email */}
        <label>Email</label>
        <input required id="email" name="email" type="text" autoComplete='off' onChange={(e) => { setEmail(e.target.value) }} />

        {/* password */}
        <label>Password</label>
        <input required id="password" name="password" type="password" onChange={(e) => { setPassword(e.target.value) }} />

        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Default</button>
      </form>
    </div>
  );
}

export default Login;
