import React, { useEffect, useState } from 'react';
import { UidContext } from './components/AppContext';
import Routes from './components/Routes';
import axios from 'axios';
import { getUser } from './actions/user.actions';
import { useDispatch } from 'react-redux';

const App = () => {
  const [uid, setUid]= useState(null);
  const dispatch = useDispatch();

// stockage de l'id (ou du token ou les deux 🤷🏽‍♀️) du user grace à useEffect 
  useEffect(() => {

    const fetchToken = async () => {
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}jwtid`, // quand il y a un get /jwtid, go dans l'api récup l'id du user 🤷🏽‍♀️ grace à axios
        withCredentials: true,
        // headers: {
        //   "Content-Type": "application/json",
        //   "Accept" : "application/json",
        //   "Authorization": "https://racoont.netlify.app"
        // },
        // on ne passe pas de data car c'est un get : on veut recupérer des informations  
      })
        .then((res) => {
          setUid(res.data); // l'id du user est renvoyé en status 200)
        })

        .catch((err) => console.log("No token")) // sinon renvoie l'erreur
      };
      fetchToken();

      if (uid) dispatch(getUser(uid)); // si uid existe, on déclanche l'action getUser grace à dispatch
  }, [uid, dispatch]); // []callback : à chaque fois que uid évolue, relance le useEffect 🤷🏽‍♀️

  return (
    // UidContext englobe toute l'application
    <UidContext.Provider value={ uid }>
      <Routes />
    </UidContext.Provider>
  );
};


export default App;