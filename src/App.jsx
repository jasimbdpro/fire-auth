import React, { useState } from 'react';
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';


const App = () => {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
  });
  const provider = new GoogleAuthProvider();

  const firebaseConfig = {
    apiKey: "AIzaSyCCuIunyXGA3Qxv8dJusKOPtr3BEkpxMYQ",
    authDomain: "ema-john-simple-905c1.firebaseapp.com",
    projectId: "ema-john-simple-905c1",
    storageBucket: "ema-john-simple-905c1.appspot.com",
    messagingSenderId: "620555579422",
    appId: "1:620555579422:web:4f78697948a35cb4ab7e0f"
  }
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app);


  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log(token)
        const { displayName, photoURL, email } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        }
        setUser(signedInUser)

      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode)
        const errorMessage = error.message;
        console.log(errorMessage)
      })
  }

  const handleSignOut = () => {
    const auth = getAuth()
    signOut(auth)
      .then(() => {

        const user = {
          inSignedIn: false,
          name: '',
          email: '',
          photo: ''
        }
        setUser(user)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <div>
      {
        user.isSignedIn ?
          <button onClick={handleSignOut}>Sign out</button> :
          <button onClick={handleSignIn}>Sign in with Google</button>
      }
      <br />

      {
        user.isSignedIn && <div> <p> {user.name}, You are successfully Logged in. </p> <p>Your email: {user.email} </p> <img src={user.photo && user.photo} alt="" /></div>
      }


    </div>
  );
};


export default App;