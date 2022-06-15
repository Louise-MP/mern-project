import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteComment, editComment } from "../../actions/post.actions";
import { UidContext } from "../AppContext";

const EditDeleteComment = ({ comment, postId }) => {
    const [isAuthor, setIsAuthor] = useState(false);  // on vérifie que le user est bien l'auteur du commentaire sinon il ne pourra pas l'éditer
    const [edit, setEdit] = useState(false); // vérifie si le user édite son message ou pas
    const [text, setText] = useState(''); // on stock le message si celui ci a été édité
    const uid = useContext(UidContext);
    const dispatch = useDispatch(); // useDispatch = c'est un **hook** de react-redux

    const handleEdit = (e) => {
        e.preventDefault();

        if (text) { // s'il y a quelque chose dans le text, go dispatch 
            dispatch(editComment(postId, comment._id, text))
            setText('')
            setEdit(false) 
        }
    }

    const handleDelete = () => dispatch(deleteComment(postId, comment._id)); // quand tout tient sur une seule ligne, pas obligé de mettre dans des accolades 🌝

    useEffect(() => {
        const checkAuthor = () => { // vérifie si c'est l'autheur du com et si c'est l'auteur, passe isAuthor sur true
            if (uid === comment.commenterId) {
                setIsAuthor(true); // isAuthor sur true permet l'affichage de toute la logique en bas 
            }
        }
        checkAuthor(); // on appelle checkAuthor quand on lance le useEffect
    }, [uid, comment.commenterId]);


    return (
        <div className="edit-comment">
            { 
                isAuthor && edit === false && ( // si isAuthor est sur true et edit sur false alors affiche ça
                    <span onClick={ () => setEdit(!edit) }>
                        <img src="./img/icons/edit.svg" alt="edit-comment" />
                    </span>
                )
            }
            {
                isAuthor && edit && ( // si isAuthor est sur true et edit sur true alors affiche le formulaire d'édition de com
                    <form action="" onSubmit={ handleEdit } className="edit-comment-form"> 
                        <label htmlFor="text" onClick={ () => setEdit(!edit) }>Éditer</label>
                        <br/>
                        <input type="text" name="text" onChange={ (e) => setText(e.target.value) } defaultValue={ comment.text }/>
                        <br />
                        <div className="btn">
                            <span onClick={() => {
                                if (window.confirm("Voulez-vous supprimer ce commentaire ?")) {
                                    handleDelete();
                                }
                            }}>
                                <img src="./img/icons/trash.svg" alt="delete" /> 
                            </span>
                            <input type="submit" value="Valider modifications"/>
                        </div>
                    </form>
                )
            }
        </div>
    )
}

export default EditDeleteComment;