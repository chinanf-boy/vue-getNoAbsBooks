const axios = require('axios');
// import api from './api'
// import store from "./store";
// import router from "./router";


axios.defaults.timeout = 5000;
if(process.env.BookDev){
    axios.defaults.baseURL = "http://localhost:5000";
}else{
    axios.defaults.baseURL = "https://getnoabsbooks.herokuapp.com";
    
}

export default axios;