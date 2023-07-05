// Frontend (React)

import React, { useState } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    const response = await fetch('http://localhost:5555/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include'
    });
  };

  const login = async () => {
    const response = await fetch('http://localhost:5555/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    const data = await response.json();
    // setUser(data.user);
    setUser({ ...data.user, name: '' });
  };

  const update = async () => {
    const response = await fetch('http://localhost:5555/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
      credentials: 'include'
    });
    const data = await response.json();
    setUser(data.user);
  };

  const logout = async () => {
    await fetch('http://localhost:5555/logout', {
      credentials: 'include'
    });
    setUser(null);
  };

  const getProfile = async () => {
    const response = await fetch('http://localhost:5555/profile', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
  
    if(response.ok) {
      const data = await response.json();
      setUser(data.user);
    } else {
      console.error('Profile retrieval failed');
      // Handle failure as needed
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <h3>{user.name}'s Profile</h3>
          <p>Email: {user.email}</p>
          <button onClick={logout}>Log out</button>
          <button onClick={getProfile}>Profile</button>
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
          <button onClick={update}>Update name</button>
        </div>
      ) : (
        <div>
          <h2>Register</h2>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <button onClick={register}>Register</button>
          <h2>Log in</h2>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <button onClick={login}>Log in</button>
        </div>
      )}
    </div>
  );
}

export default App;

