import React, { useContext } from "react";
import Log from "../components/Log" // va chercher le index.js de Log 
import { UidContext } from "../components/AppContext";
import UpdateProfil from"../components/Profil/UpdateProfil";

const Profil = () => {

    const uid = useContext(UidContext); // recupère l'id du user s'il est connecté, mais s'il ne l'est pas, propose la page connexion

    return (
        <div className="profil-page">
            { uid ? // si uid est true (si le user est co) on lui propose la page update page
                (
                    <UpdateProfil />
                ) 
                : // si le user est pas co on lui propose la page connexion ou inscription 🤷🏽‍♀️
                (
                    <div className="log-container">
                        <Log signin={ false } signup={ true } /> { /*  utilisation des props : quand on va appeler le component Log depuis cette page (profil), automatiquement, le formulaire affiché sera celui qui est sur true. ici signUp sera affiché sur la page profil */ }
                        <div className="img-container">
                            <img src="./img/log.svg" alt="img-log"/>
                        </div>  
                    </div>  
                )
            }   
        </div> 
    );
};

export default Profil;