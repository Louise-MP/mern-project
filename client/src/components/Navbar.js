import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom"; // naviguer entre les pages 
import { UidContext } from "./AppContext";
import Logout from "./Log/Logout";

const Navbar = () => {
// on recupere l'id qui est stocké tout en haut de l'application // si ce qui se trouve dans le state n'est pas null, on fait un affichage conditionnel - (voir inspecteur Components > App > hooks > States)
const uid = useContext(UidContext);

// ici, afficher le pseudo du user dynamiquement : axios va chercher dans la bdd et à l'aide de id du user (uid), le pseudo du user pour afficher le pseudo du user dynamiquement
const userData = useSelector((state) => state.userReducer); // en faisant ça,le component Navbar sait qu'il doit aller dans userReducer pour récupérer les donnée stockées sous userData
     

    return (
        <nav>
            <div className="nav-container">
                <div className="logo">
                    <NavLink exact to="/" >
                        <div className="logo">
                            <img src="./img/icon.png" alt="icon"/>
                            <h3>Raccoont</h3>
                        </div>
                    </NavLink>
                </div>
                {uid ? // si uid existe (si state n'est pas null) affiche la page profil en tant que user connecté (token)
                    (
                        <ul>
                            <li></li>
                            <li className="welcome">
                                <NavLink exact to="/profil">
                                    <h5>Bienvenue { userData.pseudo } </h5>
                                </NavLink>
                            </li>
                            <Logout />
                        </ul>
                    )
                    : // si uid n'existe ap (state est null) alors affiche la page profil en tant que user pas connecté donc affiche le formulaire d'inscription (le form inscription car on a deja décidé que la page profil affiche le formulaire d'inscription à chaque rechargement de la page)
                    (
                        <ul>
                            <li></li>
                            <li>
                                <NavLink exact to="/profil">
                                    <img src="./img/icons/login.svg" alt="login"/>
                                </NavLink>
                            </li>
                        </ul>
                    )
                }
            </div>
        </nav>
    );
};

export default Navbar;