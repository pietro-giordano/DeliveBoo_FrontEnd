import { createApp } from 'vue'
// Nel caso in cui volessimo usare SASS, è consigliabile rimuovere l'importazione del file style.css da qui (e cancellarlo eventualmente)
// Non è obbligatorio, ma potremmo creare inutili conflitti
// import './style.css'
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"

import router from "./router"

import store from "./store"

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
//
createApp(App).use(router).use(store).use(VueSweetalert2).mount('#app')