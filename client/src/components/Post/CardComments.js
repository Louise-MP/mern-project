import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, getPosts } from "../../actions/post.actions";
import FollowHandler from "../Profil/FollowHandler";
import { isEmpty, timestampParser } from "../Utils";
import EditDeleteComment from "./EditDeleteComment";

const CardComments = ({ post }) => {
    const [text, setText] = useState("");
    const usersData = useSelector((state) => state.usersReducer);
    const userData = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const handleComment = (e) => { 
        e.preventDefault(); // ne fait pas comme un formulaire de base html => reste sur la même page

        if (text) { // si le user rentre du text
            dispatch(addComment(post._id, userData._id, text, userData.pseudo)) 
            .then(() => dispatch(getPosts()))
            .then(() => setText(''))
        }
    }

    return (
        <div className="comments-container">
            { 
                post.comments.map((comment) => {
                    return (
                        // si le commerterId et le l'id du user sont identique affiche comment-container client sinon affiche le truc de base comment-container
                        <div 
                            className={ comment.commenterId === userData._id 
                                ? "comment-container client" 
                                : "comment-container" 
                            } 
                            key={ comment._id }>

                            <div className="left-part">
                                <img src={
                                        !isEmpty(usersData[0]) && usersData.map((user) => {
                                            if(user._id === comment.commenterId) return user.picture;
                                        else return null
                                        }).join("")
                                    } 
                                    alt="commenter-pic"
                                />
                            </div>
                            <div className="right-part">
                                <div className="comment-header">
                                    <div className="pseudo">
                                        <h3>{ comment.commenterPseudo }</h3>
                                       
                                        { 
                                            comment.commenterId !== userData._id && (  // pour ne pas se suivre sois-même : si commenterId n'est pas égal à userData._id, affiche la 'card' 
                                                <FollowHandler idToFollow={ comment.commenterId } type={ "card" } /> // id de la personne qui a commenté 
                                            )
                                        }

                                    </div>
                                    <span>{ timestampParser(comment.timestamp) }</span> 
                                </div>
                                <p>{ comment.text }</p>
                                <EditDeleteComment comment={ comment } postId={ post._id } /> 
                            </div>
                        </div>
                    )
                })
            }
            { 
                userData._id && ( // le user peut commenter QUE s'il est connecté
                    <form action="" onSubmit={ handleComment } className="comment-form">
                        <input type="text" name="text" onChange={ (e) => setText(e.target.value) } value={ text } placeholder="Laisser un commentaire" />
                        <br/>
                        <input type="submit" value="Envoyer"/>
                    </form>
                )
            } 
        </div> 
    )
}

export default CardComments;