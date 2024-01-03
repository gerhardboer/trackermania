// Your web app's Firebase configuration
import { firebase, firebaseui } from 'firebaseui-angular';

export const firebaseConfig = {
  apiKey: 'AIzaSyBFEKKLBdqoKH_54lgMnYcyEFiXr5eD5cs',
  authDomain: 'trackermania-fd10f.firebaseapp.com',
  databaseURL:
    'https://trackermania-fd10f-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'trackermania-fd10f',
  storageBucket: 'trackermania-fd10f.appspot.com',
  messagingSenderId: '367348447657',
  appId: '1:367348447657:web:dbfe4205d435e0da6d6cb8',
};

export const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
};
