import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../AppContext";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css"; // ne trouve pas le index.css de reactjs-popup mais ça fonctionne qd même 🤷🏽‍♀️ 
import { useDispatch } from "react-redux";
import { likePost, unlikePost } from "../../actions/post.actions";

const LikeButton = ({ post }) => { // avec post en props
    const [liked, setLiked] = useState(false);
    const uid = useContext(UidContext); // on n'a ici pas besoin de toutes les données du store concernant le user, juste l'id du user donc on travaillera ici avec le uid car c'est suffisant 
    const dispatch = useDispatch();

    const like = () => {
        dispatch(likePost(post._id, uid))
        setLiked(true);
    };

    const unlike = () => {
        dispatch(unlikePost(post._id, uid))
        setLiked(false);
    }

    useEffect(() => {
        if (post.likers.includes(uid)) setLiked(true)
        else setLiked(false)
    }, [uid, post.likers, liked]) // les 3 conditions pour lesquelles on relance le useEffect à chaque fois

    return(
        <div className="like-container">
           
            {
                uid === null && // si le user n'est pas connecté, déclenche (trigger) le popup
                ( 
                    <Popup trigger={ <img src="./img/icons/heart.svg" alt="like"/> } position={ ['bottom center', 'bottom right', 'bottom left'] } closeOnDocumentClick>
                        <div>Connectez-vous pour aimer un post ! 😬</div>
                    </Popup>
                )
            }
            {
                uid && liked === false && // si le user est connecté ET que le like est sur false, au click lance la fonctione like 💜 :)
                (
                    <img src="./img/icons/heart.svg" onClick={ like } alt="like"/>
                )
            }
            {
                uid && liked  && // si le user est connecté ET que le like est sur true, au click lance la fonctione unlike 
                (
                    <img src="./img/icons/heart-filled.svg" onClick={ unlike } alt="unlike"/>
                )
            }
        <span>{ post.likers.length }</span>
        </div>
    );
};

export default LikeButton;