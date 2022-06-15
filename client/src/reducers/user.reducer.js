// fichier qui regroupent les informations des utilisateurs connectés. grace au store de redux, qui stock les données du server qui sont necessaires de facon à ce que le front n'aille pas sans cesse interroger le back

import { FOLLOW_USER, GET_USER, UNFOLLOW_USER, UPDATE_BIO, UPLOAD_PICTURE } from "../actions/user.actions";

const initialState = {}; // ici le initialState recupère les données de l'action concernée (GET_USER ou autre) pour les rendre accessible partout dans l'app 

export default function userReducer(state = initialState, action) {
    switch (action.type) {

        case GET_USER: // si le cas est GET_USER, retourne action.payload
        return action.payload;

        case UPLOAD_PICTURE: 
        return {
            ...state,
            picture: action.payload
        };

        case UPDATE_BIO:
        return {
            ...state,
            bio: action.payload
        };

        case FOLLOW_USER:
        return {
            ...state,
            following: [action.payload.idToFollow, ...state.following]
        };

        case UNFOLLOW_USER:
        return {
            ...state,
            following: state.following.filter(
                (id) => id !== action.payload.idToUnfollow
            ),
        };

        default: 
        return state; 
    };
};

