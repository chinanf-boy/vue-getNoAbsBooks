import axios from "axios";
// import api from './api'
// import store from "./store";
// import router from "./router";

axios.defaults.timeout = 8000;
const SOURCE = "https://getnoabsbook.herokuapp.com"

if (!process.env.BOOK_DEV) {
  axios.defaults.baseURL = SOURCE;
} else {
  axios.defaults.baseURL = "http://192.168.11.103:5000";
}

// console.log(process.env.BookDev);

export default axios;
