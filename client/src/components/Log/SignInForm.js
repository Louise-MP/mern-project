import React, { useState } from 'react';
import axios from 'axios';


const SignInForm = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault(); //  prévient le comportement par défaut du rechargement de page : au click, ne recharge pas la page (single page)
        
        // récupérer les messages d'erreurs dans le dom pour les afficher dans le front (innerHTML)
        const emailError = document.querySelector(".email.error");
        const passwordError = document.querySelector(".password.error");

        // connecter le back au front... 🤷🏽‍♀️
        axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}api/user/login`, // si c'est une requete post api/user/login, ça lance la route authController.signIn
            // go activer credentials dans server.js > cors
            withCredentials: true, // withCredentials pb => erreur consoles axios/ cors Access to XMLHttpRequest at 'http://localhost:4000/api/user/login' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.
            data: {
                email, 
                password,
            },
        })
        
        .then((res) => { // (res) : résultat de la requete post
             if (res.data.errors) { // si erreur, affiche les messages d'erreurs dans le innerHTML
                emailError.innerHTML = res.data.errors.email;
                passwordError.innerHTML = res.data.errors.password; 
             }
             else {  // si pas d'erreur, renvoie le user à la page home car considéré comme connecté avec son token
                window.location = '/';
             }
        }) 
        // si erreur axios go afficher
        .catch((err) => {
            console.log(err);
        })
    };

    return (
        <form action="" onSubmit={ handleLogin } id= "sign-up-form">
            <label htmlFor="email">Email</label>
            <br/>

            <input 
            type="text" 
            name="email" id="email" 
            onChange={ (e) => setEmail
            (e.target.value) } // stockage de la valeur de l'input... 🤷🏽‍♀️
            value={ email } 
            />
            { /* message erreur email */ }
            <div className="email error">

            </div>
            <br/>

            <label htmlFor= "password">Mot de passe</label>
            <br/>

            <input 
            type= "password" 
            name= "password" 
            id= "password" 
            onChange={ (e) => setPassword
            (e.target.value) } 
            value={ password }
            />

            { /* message erreur password */ }
            <div className="password error">
               
            </div>
            <br/>

            <input  
            type="submit" 
            value="Se connecter" 
            />
        </form>
    );
};

export default SignInForm;