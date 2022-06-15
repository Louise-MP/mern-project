import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "../../actions/user.actions";
import { isEmpty } from "../Utils";

const FollowHandler = ({ idToFollow, type }) => { // type correspond à = type suggestion pour la suggestion d'ami quand on est dans la partie profil et type card pour la partie card. si c'est suggestion on propose le bouton "suivre" et si c'est card on propose la petite icone check/checked
    const userData = useSelector((state) => state.userReducer); // accès au store et à toutes les données du user qu'on vient récupérer
    const [isFollowed, setIsFollowed] = useState(false); 
    const dispatch = useDispatch();

    const handleFollow = () => {
        dispatch(followUser(userData._id, idToFollow));
        setIsFollowed(true);
    }

    const handleUnfollow = () => {
        dispatch(unfollowUser(userData._id, idToFollow)); 
        setIsFollowed(false);

    }

    useEffect(() => {  
        if (!isEmpty(userData.following)) { // si userData.following n'est pas vide 
            if (userData.following.includes(idToFollow)) { // si le user est suivi 
                setIsFollowed(true) // proposera le bouton pour ne plus suivre le user 
            }
            else setIsFollowed(false); // sinon, propose le bouton pour suivre le user
        }

    }, [userData, idToFollow]) // callback : à chaque fois que le component est appelé, relance le useEffect

    return (
        <>
        { isFollowed && !isEmpty(userData) && ( // si isFollowed est sur true (si la personne est suivie) affiche le bouton "Abonné"
            <span onClick={ handleUnfollow }> { /* au click, lance la fonction handleUnfollow (se désabonner de la personne) */ }
               { type === "suggestion" && <button className="unfollow-btn">Abonnés</button> } { /* si le type est suggestion, affiche le bouton "Abonnée" */ }
               { type === "card" && <img src="./img/icons/checked.svg" alt="checked"/> } { /* si le type est card, affiche l'icone checkée */ } 
            </span>
        )}
        { isFollowed === false && !isEmpty(userData) && ( // si isFollowed est sur false (si la personne n'est pas suivie) affiche le bouton "Suivre"
            <span onClick={ handleFollow }> { /* au click, lance la fonction handleFollow (s'abonner à la personne) */ }
                { type === "suggestion" && <button className="follow-btn">Suivre</button> } { /* si le type est suggestion, affiche le bouton "Suivre" */ }
                { type === "card" && <img src="./img/icons/check.svg" alt="check"/> } { /* si le type est card, affiche l'icone pas checkée */ } 
            </span>
        )}
        </>
    );
};

export default FollowHandler;