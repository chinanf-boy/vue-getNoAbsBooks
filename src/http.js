import axios from "axios";
// import api from './api'
// import store from "./store";
// import router from "./router";

axios.defaults.timeout = 8000;
let sW = 1

const SOURCE = "https://getnoabsbook.herokuapp.com"

if (sW) {
  axios.defaults.baseURL = SOURCE;
} else if(!sW){
  axios.defaults.baseURL = "http://localhost:5000";
}

// console.log(process.env.BookDev);

export default axios;
