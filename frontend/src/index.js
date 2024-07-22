import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
const persistor = persistStore(store);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      {/* clientId is the unique identifier for the application,
       which is used to authenticate the user with Google OAuth. and its mandatory under this above component */}
    <Provider store={store}>
      <PersistGate loading = {null} persistor={persistor}/>
      {/* provider will provide access to the store all the elements within it. */}
      <App />
    </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
