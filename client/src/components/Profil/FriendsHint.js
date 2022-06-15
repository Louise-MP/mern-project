// suggestion d'amis
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "../Utils";
import FollowHandler from "./FollowHandler";

const FriendsHint = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [playOnce, setPlayOnce] = useState(true);
    const [friendsHint, setFriendsHint] = useState([]);
    const userData = useSelector((state) => state.userReducer);
    const usersData = useSelector((state) => state.usersReducer);

    useEffect(() => {
        const notFriendList = () => { // fonction qui détermine toutes les personnes qui ne sont pas amis avec le user 
            let array = [];
    
            usersData.map((user) => {
                // pour ne pas que le user se voit proposer sont propre blaze dans les suggestions ET pour ne renvoyer que des user dont l'id du user co ne se trouve PAS dans leurs tableaux followers... 🤷🏽‍♀️
                if (user._id !== userData._id && !user.followers.includes(userData._id)) 
                return array.push(user._id)
            })
            // pour ne pas proposer toujours les mêmes user à follow...
            array.sort(() => 0.5 - Math.random()) // random = methode JS pour randomiser le resultat (le "mélanger")
            
            // pour que l'affichage de la liste des suggestions d'amis s'adapte et se coupe en fonction des différentes tailles de l'écran
            if (window.innerHeight > 780) { // si la taille de l'écran est supérieur à 780 => n'affiche que 7 éléments du tableau (array)
                array.length = 5;
            }
            else if (window.innerHeight > 720) {
                array.length = 4;
            }
            else if (window.innerHeight > 615) {
                array.length = 3;
            }
            else if (window.innerHeight > 540) {
                array.length = 1;
            }
            else {
                array.length = 0; // n'affiche rien
            }
            setFriendsHint(array)
            
        }

        if (playOnce && !isEmpty(usersData[0]) && !isEmpty(userData._id)) {
            notFriendList()
            setIsLoading(false)
            setPlayOnce(false)
        } 
    }, [usersData, userData, playOnce])

    return (
        <div className="get-friends-container">
            <h4>Suggestions</h4>
            {
                isLoading ? (
                    <div className="icon">
                        <i className="fas fa-spinner fa-pulse"></i>
                    </div>
                )
                : (
                    <ul>
                        {
                            friendsHint && friendsHint.map((user) => { // s'il y a qlq chose (user) dans le tableau FriendsHint go le retourner (les user) 🤷🏽‍♀️ avec leurs photos de profil,  pseudos etc
                                for (let i = 0; i < usersData.length; i++) {
                                    if (user === usersData[i]._id) { // si l'id du user (user)correspond aux id qui se trouventd dans usersData,
                                        return ( // s'il le trouve, retourne la liste des users que le user ne suit pas encore
                                            <li className="user-hint" key={ user }>
                                                <img src={ usersData[i].picture } alt="user-pic" />
                                                <p>{ usersData[i].pseudo }</p>
                                                <FollowHandler idToFollow={ usersData[i]._id } type={ "suggestion" } />
                                            </li>
                                        )
                                    }
                                }
                            })
                        }
                    </ul>
                )
            }
        </div>
    )
}

export default FriendsHint;