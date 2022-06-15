// pour les membres depuis ...
export const dateParser = (num) => { // une manière de traiter les dates avec javascript
    let options = { year: "numeric", month: "short", day: "numeric" };

    let timestamp = Date.parse(num);

    let date = new Date(timestamp).toLocaleDateString('fr-FR', options);

    return date.toString();
};

// pour les posts
export const postDateParser = (num) => {
    let options = { hour:"2-digit", minute:"2-digit", year: "numeric", month: "short", day: "numeric" };

    let timestamp = Date.parse(num);

    let date = new Date(timestamp).toLocaleDateString('fr-FR', options);

    return date.toString();
};

export const isEmpty = (value) => {  // fonction pour savoir si ce qui est en parametre est vide ou pas
    return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
    );
};

// date comments
export const timestampParser = (num) => {
    let options = { hour:"2-digit", minute:"2-digit", year: "numeric", month: "short", day: "numeric" };

    let date = new Date(num).toLocaleDateString("fr-FR", options);

    return date.toString();
};