// imports
import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import App from './App';
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

function CreateMessage() {

    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);
  
    const [messages] = useCollectionData (query, {idField: 'id'});
  
    const [nameValue, setNameValue] = useState('');
    const [paraValue, setParaValue] = useState('');

    // spam prevent
    const [canSend, setCanSend] = useState(true);
  
    if (!canSend) {
        alert('Message cooldown active. You can send another message in 5 minutes starting from your last message sent.')
    }
    
    const sendMessage = async(e) => {
      e.preventDefault();

      const user = auth.currentUser;
      if(!user) {
          return;
      }
  
      const { uid, photoURL } = user;
  
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
  
      setCanSend(false);
      setTimeout(() => setCanSend(true), 5 * 60 * 1000)

      setNameValue('');
      setParaValue('');
    }
  
    return (
      <div className='container mt-5' align='center' style={{maxWidth: '450px'}}>

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

      </div>
    )
}

export default CreateMessage;