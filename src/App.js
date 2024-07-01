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

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className='container'>

      <div className='card'>
        <div className='card-body'></div>
      </div>

    </div> 
  );
}

// chat message component
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const isSent = uid === auth.currentUser.uid;
  const messageClass = isSent ? 'sent' : 'received';

  return (
    <div></div>
  );
}

export default App;