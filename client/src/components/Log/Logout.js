import React from "react";
import axios from 'axios';
import cookie from 'js-cookie' // permet de retirer le cookie du user en FRONT. on le fait également dans le back pour etre sur que le cookie a bien été détruit car parfois ce n'est pas le cas 

 const Logout = () => {

    // supprimer le cookie 
    const removeCookie = (key) => { // on passe en params la clé du cookie à remove
        if (window !== "undefined") { // si window n'est pas undefined
            cookie.remove(key, { expires: 1 });
        } 
    };

    const logout = async () => {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}api/user/logout`,
            withCredentials: true
        })

        .then(() => removeCookie('jwt'))
        .catch((err) => console.log(err))

        window.location = '/'; // redirige le user vers la page accueil car il n'a plus de token
    };

    return (
        <li onClick={ logout }>
            <img src="./img/icons/logout.svg" alt="logout"/>
        </li>
    );
};

export default Logout; 