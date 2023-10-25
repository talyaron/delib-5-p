import React from 'react'
import ReactDOM from 'react-dom/client'
import './view/style/style.scss';
import "delib-npm/dist/index.css"
import { RouterProvider } from "react-router-dom";


import { store } from './model/store'
import { Provider } from 'react-redux'
import { router } from './router';




ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)


export const install:{deferredPrompt:any}= {
  deferredPrompt:null
}

window.addEventListener('beforeinstallprompt', (e) => {

  e.preventDefault();
  install.deferredPrompt = e;

});
