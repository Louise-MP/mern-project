// creation d'une const Uid que l'on peut appeler dans n'importe quel component. si le user id est connecté, grace à ce fichier on peut fournir son id sans avoir à passer par le server
// on l'appelle le haut possible dans l'application (dans le App.js)
// const Uid stocké dans le projet (useContext : bien pour stocker peu de chose mais contraignant pour stocker bcp)


import { createContext } from "react";

export const UidContext = createContext();