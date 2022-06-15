import { DELETE_COMMENT, DELETE_POST, EDIT_COMMENT, GET_POSTS, LIKE_POST, UNLIKE_POST, UPDATE_POST } from "../actions/post.actions";

const initialState = {};

export default function postReducer(state = initialState, action) {
    switch (action.type) {
        case GET_POSTS:
        return action.payload;
    
        case LIKE_POST:
        return state.map((post) => { // on identifie le message que l'on veut liker
            if (post._id === action.payload.postId) { 
                return {
                    ...post, // retourne la contenance des posts
                    likers: [action.payload.userId, ...post.likers], // ... = spread operateur : pour ne pas écraser ce qu'il y avait avant  
                }
            }
            return post;
        })

        case UNLIKE_POST:
        return state.map((post => {
            if (post._id === action.payload.postId) {
                return {
                    ...post, // retourne le post tel qu'il est
                    likers:  post.likers.filter((id) => id !== action.payload.userId) // retire du tableau likers l'id de la personne qui avait liké le post
                }
            }
            return post;
        }))

        case UPDATE_POST:
        return state.map((post) => { // on va chercher le post
            if (post._id === action.payload.postId) {  // on identifie le message en question 
                return {
                    ...post,
                    message: action.payload.message
                }
            }
            else return post;
        })

        case DELETE_POST:
        return state.filter((post) => post._id !== action.payload.postId) // retourne tous les posts sauf celui là

        // partie complexe car on doit éditer un commentaire dans un post (dans mongo : text dans comments), dont il faut d'abord séléctionner parmis les autres, le post concerné 
        case EDIT_COMMENT:
        return state.map((post) => { // repérer LE post dans lequel on va devoir éditer un commentaire 
            if (post._id === action.payload.postId) {
                return {
                    ...post,
                    comments: post.comments.map((comment) => {  // on va séléctionner LE commentaire parmis les autres, qui doit être édité
                        if (comment._id === action.payload.commentId) { 
                            return {
                                ...comment, // recup tous les comments
                                text: action.payload.text // ajoute le payload du text dans la partie text du commentaire 
                            }
                        }
                        else { // si on trouve r, retourne les commentaires, pour ne pas les écraser
                            return comment
                        }
                    })
                }
            }
            else return post
        })

        case DELETE_COMMENT:
        return state.map((post) => { // repérer LE post dans lequel on va devoir supprimer un commentaire
            if (post._id === action.payload.postId) { 
                return {
                    ...post,
                    comments: post.comments.filter(
                        (comment) => comment._id !== action.payload.commentId
                    )

                }
                
            }
            else return post;
        })
            

        default:
        return state;
    };
};


