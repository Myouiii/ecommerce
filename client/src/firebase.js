import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);
if (!firebaseConfig) {
  console.error('Please set up your firebase config in .env file');
}

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const storage = firebase.storage();

export const loginWithFaceBook = async () => {
  const fbProvider = new firebase.auth.FacebookAuthProvider();

  firebase
    .auth()
    .signInWithPopup(fbProvider)
    .then((result) => {
      console.log('result1: ', result);
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const token = result.credential.accessToken;
      // The signed-in user info.
      const { user } = result;
      console.log('User>>Facebook>', user);
      // ...
      const userId = user.uid;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const { email } = error;
      // The firebase.auth.AuthCredential type that was used.
      const { credential } = error;
      // ...
      console.error('Error: hande error here>Facebook>>', error.code);
    });
};

export { auth, storage, firebase as default };
