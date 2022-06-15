import axios from 'axios';

// quand on appelle GET_USER lance la logique de GET_USER (dans user.reducer.js). toutes actions liées au user sont regroupées dans ce fichier 
export const GET_USER = "GET_USER"; // GET_USER est une action. pour la rendre accessible partout dans l'app, go l'appeler dans l'App.js
export const UPLOAD_PICTURE = "UPLOAD_PICTURE";
export const UPDATE_BIO = "UPDATE_BIO";
export const FOLLOW_USER = "FOLLOW_USER";
export const UNFOLLOW_USER = "UNFOLLOW_USER";

// errors
export const GET_USER_ERRORS = "GET_USER_ERRORS";

// on recupère les infos concernant le user grace à axios
export const getUser = (uid) => {
    return (dispatch) => { // methode dispatch : sert à déclencher une action. l'action ici est getUser, qui consiste à envoyer les données recupérées dans la bdd, au reducer
        // avant d'envoyer les données au reducer, on les recupère dans la bdd grace à axios 
        return axios
         .get(`${process.env.REACT_APP_API_URL}api/user/${uid}`)
         // les données récupérées avec axios sont envoyées au reducer
         .then((res) => {
            dispatch({ type: GET_USER, payload: res.data })   
         })
         .catch((err) => console.log(err));
    }
}

export const uploadPicture = (data, id) => { 
    return (dispatch => {
        return axios 
        .post(`${process.env.REACT_APP_API_URL}api/user/upload`, data)
        .then((res) => {
            if (res.data.errors) {
                dispatch({ type: GET_USER_ERRORS, payload: res.data.errors })
            }
            else {
                dispatch({ type: GET_USER_ERRORS, payload: '' })
                return axios 
                .get(`${process.env.REACT_APP_API_URL}api/user/${id}`)
                .then((res) => {
                    dispatch({ type: UPLOAD_PICTURE, payload: res.data.picture })
                })
            }
        })
        .catch((err) => console.log(err));
    })
}

export const updateBio = (userId, bio) => {
    return (dispatch) => {
        return axios({
            method: "put",
            url: `${process.env.REACT_APP_API_URL}api/user/` + userId,
            data: {bio}
        })
        .then((res) => {
            dispatch({ type: UPDATE_BIO, payload: bio })
        })
        .catch((err) => console.log(err));
    }
}


export const followUser = (followerId, idToFollow) => {
    return(dispatch) => {
        return axios({
            method: "patch",
            url: `${process.env.REACT_APP_API_URL}api/user/follow/` + followerId,
            data: {idToFollow}
        })
        .then((res) => {
            dispatch({ type: FOLLOW_USER, payload: { idToFollow } });
        })
        .catch((err) => console.log(err));
    }
}

export const unfollowUser = (followerId, idToUnfollow) => {
    return(dispatch) => {
        return axios({
            method: "patch",
            url: `${process.env.REACT_APP_API_URL}api/user/unfollow/` + followerId,
            data: {idToUnfollow}
        })
        .then((res) => {
            dispatch({ type: UNFOLLOW_USER, payload: { idToUnfollow } });
        })
        .catch((err) => console.log(err));
    }
}
