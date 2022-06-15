// quand on appelle le dossier Routes ca va lire les fichiers qui se trouvent dedans (par ex pas besoin d'appeler le fichier index.js etc) 
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'; // ancienne version de RRD 5.2.0 restaurée car la navigation ne semblait ne pas fonctionner (page home qui ne s'affichait ap)... 
import Home from '../../pages/Home';
import Profil from '../../pages/Profil';
import Trending from '../../pages/Trending';
import Navbar from '../Navbar';

// ATTENTION : code modifié : obsolescence. (pas le même code que FS)
const index = () => {
    return (
        <div> 
            <Router> { /* on appelle le router/ on créer la navigation du site */ }
                <Navbar />
                <Switch>
                    <Route path="/" exact component={ Home } />
                    <Route path="/profil" exact component={ Profil } />
                    <Route path="/trending" exact component={ Trending } />
                    <Redirect to="/" /> { /* si aucun des chemins n'est trouvé, on redirige vers la page  home du site */ }
                </Switch>
            </Router>
        </div>
    );
};

export default index; 