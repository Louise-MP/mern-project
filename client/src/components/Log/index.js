import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

// INCRIPTION/ CONNEXION 
const Log = ( props ) => {
    // utilisation du hook (useState) react pour gérer le log 
    const [signUpModal, setSignUpModal] = useState(props.signup);  // setSignUpModal = seule façon d'éditer (set) ce qui se trouve dans SignUpModal
    const [signInModal, setSignInModal] = useState(props.signin); // setSignInModal = seule façon d'éditer ce qui se trouve dans SignInModal

    
    const handleModals = (e) => { // e représente l'élément qui a été cliqué
        if (e.target.id === "register") { // si le user a cliqué sur s'inscire (register)
            setSignInModal(false); // on met le formulaire connexion en false pour afficher le formulaire d'inscription
            setSignUpModal(true); // on met le formulaire d'inscription en true pour l'afficher 
        }
        else if (e.target.id === "login") { // si le user a cliqué sur se connecter (login)
            setSignUpModal(false); // on met le formulaire d'inscription en false pour afficher le formulaire de connexion
            setSignInModal(true); // on met le formulaire d'de connexion en true pour l'afficher 
        }
    }

    return (
        <div className="connection-form">
            <div className="form-container">
                <ul>
                    <li 
                    onClick={ handleModals } // si le user clique sur s'inscire, la fonction handleModals se lance pour afficher le formulaire d'inscription (register)
                    id="register" 
                    className={ signUpModal ? "active-btn" : null }> {/* ? = true : = false */}
                    S'inscrire 
                    </li> 
                    <li 
                    onClick={ handleModals } 
                    id="login" 
                    className={ signInModal ? "active-btn" : null }> {/* si signInModal = true go activer le bouton rouge */}
                    Se connecter
                    </li>
                </ul>
                { signUpModal && <SignUpForm /> } { /* si signUpModal est sur true : affiche le component formulaire SignUpForm */ }
                { signInModal && <SignInForm /> } { /* si signInModal est sur true : affiche le component formulaire SignInForm */ }
            </div>
        </div>
    );
};

export default Log;