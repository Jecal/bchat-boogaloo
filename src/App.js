import React, { useRef, useState } from 'react';
import './App.css';

// firebase sdk
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// firebase hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// web app firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">

      {/* navbar */}
      <nav className='navbar bg-body-tertiary'>
        <div className='container-lg'>
          <span className='navbar-brand mb-0'><h3>bchat-v2</h3></span>
          <SignOut />
        </div>
      </nav>

      {/* [ternary] signed-in(boolean): if true show chatroom, if false show signin */}
      <div>
        <div className='container-lg align-items-center justify-content-center'>
          {user ? <ChatRoom /> : <SignIn />}
        </div>
      </div>

    </div>
  );
}

// sign in component
function SignIn() {
  const SignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={SignInWithGoogle} className="btn btn-success">Sign In with Google</button>
  );
}

// sign out component
function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()} className='btn btn-danger'>Sign Out</button>
  )
}

// chat room component
function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData (query, {idField: 'id'});

  return (
    <div className='container-lg'>
      {/*card container*/}
      <div className='container mt-5'>
        <div className='row'>
          {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
          <span ref={dummy}></span>
        </div>
      </div>

      {/*click to create a message*/}
       <CreateMessage />
    </div> 
  );
}

// create message component
function CreateMessage() {

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData (query, {idField: 'id'});

  const [nameValue, setNameValue] = useState('');
  const [paraValue, setParaValue] = useState('');

  // form toggle
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(!showForm);
  }

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    if(!nameValue.trim() || !paraValue.trim()) {
      alert('Both fields are required.');
      return;
    }

    await messagesRef.add({
      name: nameValue,
      para: paraValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setNameValue('');
    setParaValue('');
  }

  return (
    <div className='container mt-5' align='center' style={{maxWidth: '450px'}}>
      <button className='btn btn-primary mb-5' onClick={(handleButtonClick)}>
        {showForm ? 'Cancel' : 'Click to Create a Message'}
      </button>

      {showForm && (
        <div className='card p-1'>
          <form onSubmit={sendMessage} className='p-3'>

            {/* name header input */}
            <div className='mb-3 p-2' align='left'>
              <label className='form-label'>Name</label>
              <input 
                value={(nameValue)}
                onChange={(e) => setNameValue(e.target.value)}
                className='form-control'
                placeholder='Name goes here'
              ></input>
              <div className='form-text'>Preferably just the first name</div>
            </div>

            {/* textarea code input */}
            <div className='mb-3 p-2' align='left'>
              <label className='form-label'>Message</label>
              <textarea 
                value={(paraValue)}
                onChange={(e) => setParaValue(e.target.value)}
                className='form-control'
                placeholder='Message goes here'
                maxLength={200}
              ></textarea>
            </div>

            <button type='submit' className='btn btn-success px-3'>Send!</button>
          </form>
        </div>
      )}

    </div>
  )
}

// chat message component
function ChatMessage(props) {
  const { name, para, uid, photoURL } = props.message;

  const isSent = uid === auth.currentUser.uid;

  return (
    <div className='col-md-4 mb-4'>
      <div className='card'>
        <div className='card-body'>
          <img src={photoURL} className='rounded-circle py-3' style={{maxWidth: '50px'}} alt='profile'></img>
          <div className='p-2'>
            <h4 className='card-title'>{name}</h4>
            <p className='card-text'>{para}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;