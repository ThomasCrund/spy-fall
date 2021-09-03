import './App.css';

import { useEffect, useState } from "react";

import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth"
import { getDatabase, ref, get  } from "firebase/database"

import Header from './components/Header';
import HomePage from './components/menus/HomePage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Redirect
} from "react-router-dom";
import GamePage from './components/game/GamePage';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const firebaseConfig = {
  apiKey: "AIzaSyA981ilecqUwPfNLfHUKnrSXRxKs1lFYOk",
  authDomain: "spyfall-48362.firebaseapp.com",
  projectId: "spyfall-48362",
  storageBucket: "spyfall-48362.appspot.com",
  messagingSenderId: "654824877417",
  appId: "1:654824877417:web:7813e8bffe4e79b84f21f8",
  databaseURL: "https://spyfall-48362-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getDatabase(app)

signInAnonymously(auth)


const theme = createTheme({
  palette: {
    primary: {
      light: '#B9E937',
      main: '#57D131',
      dark: '#406661',
      contrastText: '#F5F5F5',
    },
    secondary: {
      light: '#F5F5F5',
      main: '#406661',
      dark: '#406661',
      contrastText: '#F5F5F5',
    },
  },
});


function GameWrapper(props)  {
  let { code } = useParams();
  const [ valid, setValid ] = useState("pending")
  const loadingElement = <span>Loading...</span>
  useEffect(() =>  {
    return get(ref(db, `Games/${code}`)).then(snap => {
      console.log(snap.exists())
      if(!snap.exists()) {
        setValid("Invalid")
      } else {
        setValid("Valid")
      }
    })
    
  })
  return valid !== "pending" ? (
    valid === "Valid" ? 
    <GamePage gameId={code} uid={props.uid} /> :
    <Redirect to="/"/>
  ) : loadingElement
}

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    console.log("test")
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      }
    });
  });
  return user ? 
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Header user={user} dataBase={db} />

          <Switch>
            <Route path="/:code" children={<GameWrapper uid={user.uid} />} />
            <Route path="/">
              <HomePage uid={user.uid}/>
            </Route>
          </Switch>
          
        </div> 
      </Router> 
    </ThemeProvider> : null
    

  
}

export default App;
