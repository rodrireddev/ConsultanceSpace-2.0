import axios from "axios";
import firebase from "firebase/app";
import "firebase/auth";
import { API } from "./config";

// Espera a que Firebase termine de restaurar la sesión y devuelve el usuario (o null).
const currentUser = () =>
  new Promise((resolve) => {
    if (!firebase.apps.length) return resolve(null);
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });

// Todas las llamadas a nuestra API llevan el ID token de Firebase del usuario logueado.
axios.interceptors.request.use(async (config) => {
  if (config.url && config.url.startsWith(API)) {
    const user = await currentUser();
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
