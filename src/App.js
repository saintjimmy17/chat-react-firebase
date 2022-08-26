import React, {useRef, useState} from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import "firebase/compat/auth";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({

  apiKey: "AIzaSyCLTqWJpTXkU9r6skedqeS8aCizuUAo4y8",
  authDomain: "fir-chat-2271e.firebaseapp.com",
  projectId: "fir-chat-2271e",
  storageBucket: "fir-chat-2271e.appspot.com",
  messagingSenderId: "1028014977646",
  appId: "1:1028014977646:web:137a14718aa4e17130ec7f"

})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Chat con React y Firebase💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
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

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Di algo..." />

      <button type="submit" disabled={!formValue}>📨</button>

    </form>
  </>)
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://scontent.fcor11-2.fna.fbcdn.net/v/t1.15752-9/294490798_3177985852519484_5339882633757713976_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=ae9488&_nc_ohc=jkxOlvyMvtAAX8RlfyC&_nc_ht=scontent.fcor11-2.fna&oh=03_AVK0xqRoVKWT6gWAf_rcI52Mv42D55404d-0_88pxd72Wg&oe=632F2278'} />
      <p>{text}</p>
    </div>
  </>)
}

export default App;
