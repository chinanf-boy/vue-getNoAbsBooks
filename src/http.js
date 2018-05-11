const axios = require('axios');
// import api from './api'
// import store from "./store";
// import router from "./router";


axios.defaults.timeout = 5000;
axios.defaults.baseURL = "http://localhost:5000";

export default axios;