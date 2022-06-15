import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postDateParser, isEmpty } from "../Utils";
import FollowHandler from "../Profil/FollowHandler";
import LikeButton from "./LikeButton";
import { updatePost } from "../../actions/post.actions";
import DeleteCard from "./DeleteCard";
import CardComments from "./CardComments";

const Card = ({ post }) => { // props post
    const [isLoading, setisLoading] = useState(true); // tant que la data de la card n'est pas prete, on met une icone de chargement pour faire patienter l'utilisateur. true = ça charge de base...
    const [isUpdated, setIsUpdated] = useState(false);
    const [textUpdate, setTextUpdate] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const usersData = useSelector((state) => state.usersReducer);
    const userData = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    // declenche l'action pour update le message
    const updateItem = () => {
        if (textUpdate) { // si quelque chose a été mis à l'intérieur (si le user à fait une modif)
            dispatch(updatePost(post._id, textUpdate))
        }
        setIsUpdated(false);
    }
    
    useEffect(() => {
        !isEmpty(usersData[0]) && setisLoading(false); // si on a les données utilisateurs, on passe le isLoading sur false
    }, [usersData]);

    return (
        <li className="card-container" key={ post._id }>
            { isLoading ?  // est ce que isLoading est sur true ? 
                // s'il est sur true on envoie l'icone de chargement 
                (  
                    <i className="fas fa-spinner fa-spin"></i> // grace à fa-spin le truc va tourner tout seul
                )
                :
                // s'il est sur false on affiche le bay
                (
                    <>
                        <div className="card-left">
                            <img src=
                                {
                                    !isEmpty(usersData[0]) && usersData.map((user) => {
                                        if(user._id === post.posterId) return user.picture;
                                       else return null
                                    }).join("")
                                } 
                                alt="poster-pic"
                            />
                        </div>
                        <div className="card-right">
                            <div className="card-header">
                                <div className="pseudo">
                                    <h3>
                                        {
                                            !isEmpty(usersData[0]) && usersData.map((user) => {
                                                if(user._id === post.posterId) return user.pseudo;
                                                else return null
                                            }).join("")
                                        }
                                    </h3>
                                    { post.posterId !== userData._id && ( // pour que la personne qui est sur son propre compte ne puisse pas se demander elle meme en ami  
                                        <FollowHandler idToFollow={ post.posterId } type={ "card" }/>
                                    ) } 
                                    
                                </div>
                                <span>{ postDateParser(post.createdAt) }</span> { /* code modifié : ajout d'un postDateParser au lieu de dateParser (je veux l'heure complete pour les posts mais pas pour les "membre depuis ....")*/ }
                            </div>

                            {/* mettre à jour le message */}
                            { isUpdated === false && <p>{ post.message }</p> }
                            { isUpdated && 
                                (
                                    <div className="update-post">
                                        <textarea 
                                            defaultValue={ post.message }  
                                            onChange={ (e) => setTextUpdate(e.target.value) }  
                                        />
                                        <div className="button-container">
                                            <button className="btn" onClick={ updateItem }>
                                                Valider modifications
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                            { post.picture && (
                                <img src={ post.picture } alt="card-pic" className="card-pic"/>
                            ) }
                            { post.video && (
                                <iframe
                                    width="500"
                                    height="300"
                                    src={ post.video }
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={post._id}
                                ></iframe>
                            ) }
                            { userData._id === post.posterId && // si c'est la meme personne qui surf et qui à posté le message
                                (
                                    <div className="button-container">
                                        { /* au click, met en place l'édition. (!isUpdated = on donne la valeur inverse pour pouvoir cliquer et lancer l'edition et re cliquer dessus et sortir du mode edition) */ } 
                                        <div onClick={ () => setIsUpdated(/* true */!isUpdated) }> 
                                            <img src="./img/icons/edit.svg" alt="edit"/>
                                        </div>
                                        <DeleteCard id={ post._id }  />
                                    </div>
                                )
                            }
                            <div className="card-footer">
                                <div className="comment-icon">
                                    <img 
                                    onClick={() => setShowComments(!showComments)} 
                                    src="./img/icons/message1.svg" 
                                    alt="comment"/>
                                    <span>{ post.comments.length }</span>
                                </div>
                                <LikeButton post={ post } /> { /* avec post en props */ }
                                <img src="./img/icons/share.svg" alt="share"/>
                            </div>
                            { showComments && <CardComments post={ post } /> }
                        </div>
                    </>
                )
            } 
        </li>
    );
};

export default Card;