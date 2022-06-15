import React, { useState } from 'react';
import axios from 'axios';
import SignInForm from './SignInForm';

const SignUpForm = () => {
    const [formSubmit, setFormSubmit] = useState(false); // le formulaire a t'il été submit ? (false : comportement par defaut 🤷🏽‍♀️ )

    const [pseudo, setPseudo] = useState(""); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [controlPassword, setControlPassword] = useState("");
    
    const handleRegister = async(e) => {
        e.preventDefault();
        // balises vides dans lesquelles seront injectés du texte selon l'erreur qui est renvoyée 
        const terms = document.getElementById('terms'); // conditions generales
        const pseudoError = document.querySelector('.pseudo.error');
        const emailError = document.querySelector('.email.error');
        const passwordError = document.querySelector('.password.error');
        const passwordConfirmError = document.querySelector('.password-confirm.error');
        const termsError = document.querySelector('.terms.error'); 

        // à chaque fois que l'on recharge la page, reset 
        passwordConfirmError.innerHTML = "";
        termsError.innerHTML = "";

        // si jamais les mots de passe renseignés par le user ne correspondent pas
        if (password !== controlPassword || !terms.checked) {
            if (password !== controlPassword)
                passwordConfirmError.innerHTML = "Les mots de passe ne correspondent pas";

            // si les conditions generales ne sont pas cochées
            if (!terms.checked)
                termsError.innerHTML = "Veuillez valider les conditions générales";
        }
        // connexion back front (si tout est ok au dessus on envoie les données du form à la bdd qui va enregistrer un nv user)
        else {
            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}api/user/register`,
                data: {
                    pseudo,
                    email,
                    password
                }
            }) 

            .then((res) => {
                console.log(res);
                if(res.data.errors) {
                    pseudoError.innerHTML = res.data.errors.pseudo;
                    emailError.innerHTML = res.data.errors.email;
                    passwordError.innerHTML = res.data.errors.password;
                }
                else { // s'il n'y a pas d'erreur, renvoie le formulaire de 
                    setFormSubmit(true); 
                }
            })
                
            .catch((err) => console.log(err)); 
        }
        
    };


    return (
          
        <>  { /* fragment : sert de balise vide surperieure aux autres. necessaire pour renvoyer un component */ }
            {formSubmit ? // si formSubmit est true, on renvoie le formulaire de connexion (signInForm) au user
                (  
                    <>
                        <SignInForm />
                        <span></span>
                        <h4 className="sucess">Compte créé avec succès 🎉 Connectez-vous !</h4>
                    </>
                ) 
                : // si formSubmit est false, affiche le formulaire d'inscription
                (
                    <form action="" onSubmit={ handleRegister } id="sign-up-form"> { /* à la soumission du formulaire (onSubmit), lance la fonction handleRegister */ }
                        <label htmlFor="pseudo"/>Pseudo<label/>
                        <br/>
                        <input 
                        type="text" 
                        name="pseudo"  
                        id="pseudo" 
                        onChange={(e) => setPseudo(e.target.value)} // permet d'incrémenter la valeur récupérée dans l'input
                        value={ pseudo } 
                        />  
                        <div className="pseudo error"></div>

                        <br/>

                        <label htmlFor="email"/>Email<label/>
                        <br/>
                        <input 
                        type="text" 
                        name="email"  
                        id="email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={ email } 
                        />  
                        <div className="email error"></div>

                        <br/>

                        <label htmlFor="password"/>Mot de passe<label/>
                        <br/>
                        <input 
                        type="password" 
                        name="password"  
                        id="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={ password } 
                        />  
                        <div className="password error"></div>

                        <br/>

                        <label htmlFor="password-conf"/>Confirmer le mot de passe<label/>
                        <br/>
                        <input 
                        type="password" 
                        name="password"  
                        id="password-conf" 
                        onChange={(e) => setControlPassword(e.target.value)} 
                        value={ controlPassword } 
                        />  
                        <div className="password-confirm error"></div>

                        <br/>

                        <input
                        type="checkbox" id="terms" />
                        <label htmlFor="terms">J'accepte les <a href="/" target="_blank"
                        rel="noopener noreferrer">conditions générales</a></label>
                        <div className="terms error"></div>

                        <br/>

                        <input type="submit" value="Valider inscription" />
                    </form>
                )
            }  
        </> 
    );
    
};

export default SignUpForm; 