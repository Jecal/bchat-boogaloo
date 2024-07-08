// imports
import React, { useRef, useState } from 'react';
import { BrowsesrRouter as Router, useNavigate } from 'react-router-dom';
import './App.css';

// firebase sdk
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// firebase hooks
import { useCollectionData } from 'react-firebase-hooks/firestore';

// webapp config
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// webapp vars for config
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

function MessageForm({ setIsToggled }) {
    // get messages
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    // access messages
    const [messages] = useCollectionData (query, {idField: 'id'});

    // vars for user input
    const [nameValue, setNameValue] = useState('');
    const [paraValue, setParaValue] = useState('');

    // message sending function
    const sendMessage = async(e) => {

        // prevent default form action
        e.preventDefault();

        // user access variables
        const user = auth.currentUser;
        const { uid, photoURL } = user;

        // if user is not logged in, don't work
        if (!user) {
            return;
        }

        // if user forms are null, don't send
        while(!nameValue.trim() || !paraValue.trim()) {
            return;
        }

        // await messages, and make the vars be their corresponding vals
        await messagesRef.add ({
            name: nameValue,
            para: paraValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        })

        // reset form
        setNameValue('');
        setParaValue('');

        // go back to other page
        setIsToggled(true);
    }
    
    return(
        <div className='container mt-5' align='center' style={{maxWidth: '450px'}}>
            
            <div className='card p-1'>
                {/* form */}
                <form onSubmit={sendMessage} className='p-3'>

                    {/* name header input */}
                    <div className = 'mb-3 p-2' align='left'>
                        <label className='form-label'>Name</label>
                        <input
                            value={(nameValue)}
                            onChange={(e) => setNameValue(e.target.value)}
                            className='form-control'
                            placeholder='Your name goes here'
                        ></input>
                        <div className='form-text'>
                            Preferably just your first name (real or fake doesn't matter)
                        </div>
                    </div>

                    {/* text area */}
                    <div className ='mb-3 p-2' align='left'>
                        <label className='form-label'>Message</label>
                        <textarea
                            value={(paraValue)}
                            onChange={(e) => setParaValue(e.target.value)}
                            className='form-control'
                            placeholder='Your message goes here'
                            maxLength={200}
                        ></textarea>
                        <div className='form-text'>
                            No longer than 200 characters
                        </div>
                    </div>

                    {/* submit button */}
                    <button type='submit' className='btn btn-success px-3'>
                        Send
                    </button>

                </form>

            </div>

        </div>
    )
}

export default MessageForm;