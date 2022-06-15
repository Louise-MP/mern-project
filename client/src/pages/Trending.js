import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { UidContext } from "../components/AppContext";
import LeftNav from "../components/LeftNav";
import { isEmpty } from "../components/Utils";
import Card from "../components/Post/Card";
import Trends from "../components/Trends";
import FriendsHint from "../components/Profil/FriendsHint";

const Trending = () => {
    const uid = useContext(UidContext) // pas besoin d'appeler le store vu que l'on a besoin que de l'id du user...
    const trendList = useSelector((state) => state.trendingReducer);

    return (
        <div className="trending-page">
            <LeftNav />
            <div className="main">
                <ul>
                    {
                        !isEmpty(trendList[0]) && trendList.map((post) => <Card post={ post } key={ post._id } />)
                    }
                </ul>
            </div>
            <div className="right-side">
                <div className="right-side-container">
                    <Trends />
                    { /* si le user est connecté, appelle component FriendsHint */ }
                    { uid && <FriendsHint /> }
                </div>
            </div>
        </div>
    );
};

export default Trending; // export par defaut dans l'app : on peut appeler cette page de partout dans l'app