// fil d'actualité
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../actions/post.actions";
import Card from "./Post/Card";
import { isEmpty } from "./Utils";

const Thread = () => {
    const [loadPost, setLoadPost] = useState(true);
    const [count, setCount] = useState(5); // compteur de post pour l'ifinite scroll. affiche 5 posts
    const dispatch = useDispatch(); // lancer l'action
    const posts = useSelector((state) => state.postReducer); // récupérer les posts dans le store

    const leadMore = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 > document.scrollingElement.scrollHeight) { // si on est en bas de la page (quand la barre du scroll touche le bas) on rentre dans la condition suivante 
            setLoadPost(true);
        }  
    }

    // recupérer tous les posts
    useEffect(() => {
         if (loadPost) {
            dispatch(getPosts(count)); // on rempli le store avec les posts recup
            setLoadPost(false);
            setCount(count + 5); // setCount => important dans cet ordre car on incrémente de 5 posts en plus AVANT de relancer la fonction 

         }

        window.addEventListener('scroll', leadMore) // à chaque fois qu'il y a un scroll, lance fonction leadMore
        return () => window.removeEventListener('scroll',  leadMore);
    }, [loadPost, dispatch, count]);

    return (
        <div className="thread-container">
            <ul>
                {
                    !isEmpty(posts[0]) && 
                    posts.map((post) => {
                        return <Card post={ post } key={ post._id }/>;  // retourne Card.js avec une clé unique ET post en props, qui renferme tous les informations du post (c-à-d l'id, le postId, le message, les commentaires etc...)
                    })
                }
            </ul>
        </div>
    );
};

export default Thread;

