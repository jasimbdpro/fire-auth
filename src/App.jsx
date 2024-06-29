import React, { useState } from 'react';
import { initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';


const App = () => {
  const [newUser, setNewUser] = useState(false);
  const [accountUser, setAccountUser] = useState({
    isSignedIn: false,
    newUserInfo: false,
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
        if (result.accountUser) {
          const { displayName, photoURL, email } = result.accountUser;
          const signedInUser = {
            isSignedIn: true,
            name: displayName,
            email: email,
            photo: photoURL,
          }
          setAccountUser(signedInUser)
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

        const accountUser = {
          inSignedIn: false,
          name: '',
          email: '',
          photo: ''
        }
        setAccountUser(accountUser)
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
      const isPasswordValid = event.target.value.length > 5
      const passwordHasNumber = /\d{1}/.test(event.target.value)
      isFieldValid = isPasswordValid && passwordHasNumber
    }
    if (isFieldValid) {
      const newUserInfo = { ...accountUser }
      newUserInfo[event.target.name] = event.target.value
      setAccountUser(newUserInfo)

    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Submit button clicked");

    if (newUser && accountUser.email && accountUser.password) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, accountUser.email, accountUser.password)
        .then((userCredential) => {
          console.log("User created:", userCredential.user);

          const newUserInfo = { ...accountUser, success: true, error: '' };
          setAccountUser(newUserInfo);

          // Signed up
          const user = userCredential.user;
          console.log(user.email, user.displayName);
          updateNameOfUser(accountUser.name)
        })
        .catch((error) => {
          console.log("Error creating users:", error.message);

          const newUserInfo = { ...accountUser, error: error.message, success: false };
          setAccountUser(newUserInfo);
        });
    }
    if (!newUser && accountUser.email && accountUser.password) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, accountUser.email, accountUser.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          const newUserInfo = { ...accountUser, name: user.displayName, success: true, error: '' }
          setAccountUser(newUserInfo)

          // ...
        })
        .catch((error) => {
          const newUserInfo = { ...accountUser, success: false, error: error.message }
          setAccountUser(newUserInfo)
        });
    }
  };
  const updateNameOfUser = name => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: name
    }).then(() => {
      // Profile updated!
      // ...
    }).catch((error) => {
      // An error occurred
      // ...
    });

  }


  return (
    <div>
      {
        accountUser.isSignedIn ?
          <button onClick={handleSignOut}>Sign out</button> :
          <button onClick={handleSignIn}>Sign in with Google</button>
      }
      <br />

      {
        accountUser.isSignedIn && <div> <p> {accountUser.name}, You are successfully Logged in. </p> <p>Your email: {accountUser.email} </p> <img src={accountUser.photo && accountUser.photo} alt="" /></div>
      }

      <h1>Our Authentication System</h1>

      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="newUser22" />
      <label htmlFor="newUser22">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input type="text" required name="name" onBlur={handleBlur} id="" placeholder='your name' />}
        <br />
        <input type="text" name='email' onBlur={handleBlur} required placeholder='Enter your email' />
        <br />
        <input type="password" name='password' onBlur={handleBlur} required placeholder='Enter your passoword' />
        <br />
        <input type="submit" value="Submit" />

      </form>
      <p style={{ color: 'red' }} >{accountUser.error}</p>
      {
        accountUser.success && <p style={{ color: 'green' }} > {accountUser.name}, Account {newUser ? 'created' : 'logged in'} successfully</p>
      }

    </div>
  );
};


export default App;