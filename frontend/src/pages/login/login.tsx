import React, { useState } from 'react';

//Components

function Login() {


  //Login variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault()

    console.log(username)
    console.log(password)
  }

  return (
    <div>
      <p>This is login page</p>
      <form onSubmit={handleLogin}>
        {/* username */}
        <label>Username</label>
        <input required id="username" name="username" type="text" autoComplete='off' onChange={(e) => { setUsername(e.target.value) }} />

        <label>Password</label>
        <input required id="password" name="password" type="password" onChange={(e) => { setPassword(e.target.value) }} />

        <button type='submit'>Login</button>

      </form>
    </div>
  );
}

export default Login;
