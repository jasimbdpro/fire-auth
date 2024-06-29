import React, { useState } from 'react';
import { initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';


const App = () => {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    success: false,
    error: '',
  });
  const provider = new GoogleAuthProvider();

  const firebaseConfig = {
    apiKey: "AIzaSyDtJmJoeI6buRwNeabbzgMwZfHgZelAXD4",
    authDomain: "fire-auth-2-1fe09.firebaseapp.com",
    projectId: "fire-auth-2-1fe09",
    storageBucket: "fire-auth-2-1fe09.appspot.com",
    messagingSenderId: "560919570434",
    appId: "1:560919570434:web:f1afab6763ff67b4529f1b"
  }
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app);


  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log(token)
        if (result.user) {
          const { displayName, photoURL, email } = result.user;
          const signedInUser = {
            isSignedIn: true,
            name: displayName,
            email: email,
            photo: photoURL,
          }
          setUser(signedInUser)
        }

      })
      .catch((error) => {

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
  const handleBlur = (event) => {
    let isFieldValid = true;
    if (event.target.name === 'email') {
      isFieldValid = /^\S+@\S+\.\S+$/.test(event.target.value)
    }
    if (event.target.name === 'password') {
      const isPasswordValid = event.target.value.length > 6
      const passwordHasNumber = /\d{1}/.test(event.target.value)
      isFieldValid = isPasswordValid && passwordHasNumber
    }
    if (isFieldValid) {
      const newUserInfo = { ...user }
      newUserInfo[event.target.name] = event.target.value
      setUser(newUserInfo)

    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Submit button clicked");

    if (user.email && user.password) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          console.log("User created:", userCredential.user);

          const newUserInfo = { ...user, success: true, error: '' };
          setUser(newUserInfo);

          // Signed up
          const createdUser = userCredential.user;
          console.log(createdUser.email, createdUser.displayName);
        })
        .catch((error) => {
          console.log("Error creating user:", error.message);

          const newUserInfo = { ...user, error: error.message, success: false };
          setUser(newUserInfo);
        });
    } else {
      console.log("Email or password is missing.");
    }
  };


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

      <h1>Our Authentication System</h1>


      <form onSubmit={handleSubmit}>
        <input type="text" name="name" onBlur={handleBlur} id="" placeholder='your name' />
        <br />
        <input type="text" name='email' onBlur={handleBlur} required placeholder='Enter your email' />
        <br />
        <input type="password" name='password' onBlur={handleBlur} required placeholder='Enter your passoword' />
        <br />
        <input type="submit" value="Submit" />

      </form>
      <p style={{ color: 'red' }} >{user.error}</p>
      {
        user.success && <p style={{ color: 'green' }} >Account created successfully</p>
      }

    </div>
  );
};


export default App;