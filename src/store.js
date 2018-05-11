import Vue from "vue";
import Vuex from "vuex";
import axios from "./http";


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    books: []
  },
  mutations: {
    clearBooks(state){
      state.books = []
    },
    addBooks(state, data) {
      Object.keys(data).forEach(
        ID =>{
          state.books.push(data[ID])
        }
      )
    }
  },
  actions: {
    getAllBooks({
      commit
    }) {
      commit('clearBooks')
            
      axios.get('/api/getAllBooks').then(res => {
        commit("addBooks", res.data.result)
      }).catch(err =>console.error(err))
    },
    getBookIndex({commit}){
      
    }
  }
});