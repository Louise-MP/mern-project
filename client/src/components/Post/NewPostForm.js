import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { isEmpty, timestampParser } from "../Utils";
import { addPost, getPosts } from "../../actions/post.actions";

const NewPostForm = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [postPicture, setPostPicture] = useState(null);
    const [video, setVideo] = useState("");
    const [file, setFile] = useState();
    const userData = useSelector((state) => state.userReducer); // le useSelector permet d'aller chercher ce qui est contenu dans le store
    const error = useSelector((state) => state.errorReducer.postError);

    const dispatch = useDispatch();

    const handlePost = async () => {
        if (message || postPicture || video) {

            const data = new FormData() // pour stocker le fichier, le texte éventuellement
            data.append('posterId', userData._id);
            data.append('message', message);
            if (file) data.append("file", file);
            data.append('video', video);

            await dispatch(addPost(data)) // on envoie la data à la bdd
            dispatch(getPosts()); // la bdd nous renvoie la data avec les id unique qu'elle a créé 🤷🏽‍♀️ (éviter les conflits)
            cancelPost();
        }
        else {
            alert("Veuillez entrer un message")
        }
    };

    const handlePicture = (e) => {
        setPostPicture(URL.createObjectURL(e.target.files[0]))
        setFile(e.target.files[0])
        setVideo("") // s'il y avait une video déjà présente dans le post, on la retire
    };


    const cancelPost = () => {
        setMessage('');
        setPostPicture('');
        setVideo('');
        setFile('');
    };

    

    useEffect (() => {
        if (!isEmpty(userData)) setIsLoading(false); // si userData n'est pas vide, alors met le setIsLoading sur false, n'affiche plus le spinner mais affiche la logique (:)
        
        const handleVideo = () => { // 
            let findLink = message.split(" "); // permet d'annalyser le message du post pour voir s'il contient une video (split : permet de transformer une string en tableau en séparant les données par un espace). s'il y a un lien youtube dans le message alors .... 
            
            for (let i = 0; i < findLink.length; i++) {
    
                if (findLink[i].includes("https://www.yout") || findLink[i].includes("https://yout")) {
    
                    let embed = findLink[i].replace("watch?v=", "embed/") // remplace le 1er element par le 2e. grace à embed, la video sera lisible par un autre lecteur que watch...
                    setVideo(embed.split('&')[0])
                    findLink.splice(i, 1); // retirer le lien youtube du input
                    setMessage(findLink.join(" "))
                    setPostPicture("") // s'il y avait déjà une photo présente dans le post, on la retire (on veut qu'un post ne puisse contenir que l'un ou l'autre à la fois)
                }
            }
        };
        handleVideo();
    }, [userData, message, video])


    return (
        <div className="post-container">
            {
                isLoading ? 
                (
                    <i className="fas fa-spinner fa-pulse"></i>
                )
                :
                (
                    <>
                        { /* data correspond à l'affichage des données 5 abonnés, 10 abonnements etc... */ }
                        <div className="data">
                            <p>
                                <span>
                                    { /* si userData existe alors affiche les données (length) sinon affiche 0 */ }
                                    { userData.following ? userData.following.length : 0 } 
                                </span>
                                { /* affichage conditionnel du s à la fin => si userData.following existe ET userData.following.length est plus grand que 1, affiche le s, sinon ne fait rien (null) */ }
                                { " " } Abonnement{ userData.following && userData.following.length > 1 ? "s" : null } 
                            </p>
                            <p>
                                <span>
                                    { userData.followers ? userData.followers.length : 0 } 
                                </span>
                                { " " } Abonné{ userData.followers && userData.followers.length > 1 ? "s" : null }
                            </p>
                        </div>
                        <NavLink exact to="/profil">
                            <div className="user-info">
                                <img src={ userData.picture } alt="user-img" />
                            </div> 
                        </NavLink>
                        <div className="post-form">
                            <textarea
                                name="message" 
                                id="message"
                                placeholder="Quoi de neuf ?"
                                onChange={ (e) => setMessage(e.target.value) } // => que se passe t il si le user change (onChange ) un truc dans le textarea ? => on incrémente le message pour l'envyer à redux
                                value={ message }
                            />
                            { /* petit conteneur de PREVISUALISATION DU POST sous le "Quoi de neuf ?" */ }
                            {
                                message || postPicture || video.length > 20 ? ( // si une des trois conditions sont respectées 
                                
                                   <li className="card-container">
                                        <div className="card-left">
                                            <img src={ userData.picture } alt="user-pic" />
                                        </div>
                                        <div className="card-right">
                                            <div className="card-header">
                                                <div className="pseudo">
                                                    <h3>{ userData.pseudo }</h3>
                                                </div>
                                                <span>{ timestampParser(Date.now())  }</span>
                                            </div>
                                            <div className="content ">
                                                <p>{ message /* renvoie le message si c'est un post qui ne contient qu'un message */ }</p>
                                                <img src={ postPicture /* renvoie la photo du post si photo de post il y a etc... */ } alt="" />
                                                {
                                                    video && (
                                                        <iframe
                                                        src={ video }
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        title={ video }
                                                    ></iframe>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </li>
                                )
                                : null
                            }
                            <div className="footer-form">
                                <div className="icon"> 
                                    { /* affiche QUE SI il n'y a pas deja une vidéo qui a été telechargée ici */ }
                                    { 
                                        isEmpty(video) && ( // si video est vide, alors affiche icone pour télécharger un fichier
                                            <>
                                                <img src="./img/icons/picture.svg" alt="img" />
                                                <input type="file" id="file-upload" name=" file" accept=".jpg, .jpeg, .png" onChange={ (e) => handlePicture(e) }/>
                                            </>
                                        ) 
                                    }
                                    {
                                        video && ( // s'il existe une video, affiche le bouton pour supp la video
                                            <button oncClick={ () => setVideo('') }>Supprimer vidéo</button>
                                        )
                                    }
                                </div>

                                {
                                    // message d'erreur format
                                    !isEmpty(error.format) && <p>{ error.format }</p> // si error.format n'est pas vide, alors affiche l'erreur
                                }
                                {
                                    // message d'erreur taille
                                    !isEmpty(error.maxSize) && <p>{ error.maxSize }</p>
                                }

                                <div className="btn-send">
                                    {
                                        message || postPicture || video.length > 20 ?
                                           
                                            (
                                                <button className="cancel" onClick={ cancelPost }>Annuler message</button>
                                            )
                                        : 
                                        null
                                    }
                                    <button className="send" onClick={ handlePost }>Envoyer</button>
                                </div>
                            </div>
                        </div>
                    </>
                )
              
            }
        </div>
    )
}

export default NewPostForm;