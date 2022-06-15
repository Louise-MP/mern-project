import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/index.scss';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux'; 
import thunk from 'redux-thunk'; // tres important pour travailler avec redux 
import rootReducer from './reducers/';
import { getUsers } from './actions/users.actions';
import { getPosts } from './actions/post.actions';

// devtools
// redux-devtools-extension et logger : outils pour développeurs : ne s'utilise que en prod (eviter l'accès au données par les utilisateurs)
import { composeWithDevTools } from 'redux-devtools-extension'; 
// import logger from 'redux-logger'; // inutile d'utiliser deux outils 

const store = createStore(
  rootReducer, composeWithDevTools(applyMiddleware(thunk, /*logger*/))
)


store.dispatch(getUsers()); // dès que l'application se lance, lance getUsers (appel tous les users)
store.dispatch(getPosts()); // dès que l'application se lance, lance getPosts (appel tous les messages)


// code modifié
// WARNING CONSOLE => Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot
// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// );
// SOLUTION
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Provider store={store}><App /></Provider>);


// App.js => contient tous les affichages de components et toute la logique
 

