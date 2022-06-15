import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrends } from "../actions/post.actions";
import { isEmpty } from "./Utils";
import { NavLink } from "react-router-dom";

const Trends = () => {
    const posts = useSelector((state) => state.allPostsReducer);
    const usersData = useSelector((state) => state.usersReducer); 
    const trendList = useSelector((state) => state.trendingReducer); 
    const dispatch = useDispatch();


    useEffect(() => {
        if (!isEmpty(posts[0])) { // si posts n'est pas empty, s'il ya qlq chose dedans

            // triage des posts du plus liké au moins liké (methode JS qu'on trouve sur StackOverflow)
            const postsArr = Object.keys(posts).map((i) => posts[i])
            let sortedArray = postsArr.sort((a, b) => {
                return b.likers.length - a.likers.length
            })
            sortedArray.length = 3; // n'affiche que les 3 posts les plus likés
            dispatch(getTrends(sortedArray)) // déclenche l'action getTrends du store trending ... 🤷🏽‍♀️ 
        }

    }, [posts, dispatch]) // quand il a la data de posts, relance la fonction useEffect

    return (
        <div className="trending-container">
            <h4>Trending</h4>
            <NavLink exact to="/trending">
                <ul>
                    { 
                        trendList.length && trendList.map((post) => {
                            return (
                                <li key={ post._id }>
                                    <div> 
                                        { /* si le post contient une image ou une video alors affiche l'image ou la vidéo du post */ }
                                        { post.picture && <img src={ post.picture } alt="post-pic" /> }
                                        { post.video && (
                                            <iframe
                                            src={post.video}
                                            frameBorder="0"
                                            allow= "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={post._id}
                                            ></iframe>
                                        )}
                                        { /* par contre si le post ne contient pas d'image ou de video alors affiche la photo de profil de l'utilisateur */ }
                                        {
                                            isEmpty(post.picture) && isEmpty(post.video) && (
                                                <img src={usersData[0] && usersData.map((user) => {
                                                    if (user._id === post.posterId) {
                                                        return user.picture
                                                    }
                                                    else return null;
                                                }).join("")
                                                } alt="profil-pic" />
                                            )
                                        }
                                    </div>
                                    <div className="trend-content">
                                        <p>{ post.message }</p>
                                        <span>Voir plus</span>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </NavLink>
        </div>
    )
}

export default Trends;