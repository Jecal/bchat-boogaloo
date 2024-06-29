import React, { useRef, useState } from 'react';
import './App.css';

function App() {

  return (
    <div className="App">
      <nav className='navbar bg-body-tertiary'>
        <div className='container'>
          <a className='navbar-brand' href="#">bchat boogaloo</a>

          <SignOut />
        </div>
      </nav>
    </div>
  );
}

// sign in component
function SignIn() {
  return (
    <button className="btn btn-success">Sign In with Google</button>
  );
}

// sign out component
function SignOut() {
  return (
    <button className='btn btn-danger'>Sign Out</button>
  )
}

// chat room component


// chat message component

export default App;