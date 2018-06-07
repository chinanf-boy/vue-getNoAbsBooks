const axios = require("axios");
// import api from './api'
// import store from "./store";
// import router from "./router";

axios.defaults.timeout = 5000;

if (!process.env.BOOK_DEV) {
  axios.defaults.baseURL = "https://getnoabsbooks.herokuapp.com";
} else {
  axios.defaults.baseURL = "http://192.168.11.103:5000";
}

// console.log(process.env.BookDev);

export default axios;
