import Vue from "vue";
import Vuex from "vuex";
import axios from "./http";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    books: [],
    Api: "http://m.76wx.com",
    suffix: "html"
  },
  mutations: {
    clearBooks(state) {
      state.books = []
    },
    addBooks(state, data) {
      Object.keys(data).forEach(
        bookName => {
          state.books.push(data[bookName])
        }
      )
    },
    changeApi(state, data){
      state.Api = data
    },
    changeSuffix(state, data){
      state.suffix = data
    },
  },
  actions: {
    addJsonStore(state, id){
      axios.post('/api/addJsonStore', {id}).then(res =>{
        console.log('add jsonstore',res.data.ok)
      }).catch(err => console.error(err))
    },
    getAllBooks({
      commit
    }) {
      commit('clearBooks')

      axios.get('/api/getAllBooks').then(res => {
        commit("addBooks", res.data.result)
      }).catch(err => console.error(err))
    },
    getBookIndex({
      commit, state
    }, {id, pages} ) {

      let URL = state.Api +'/book/' + id + '/'

      if(pages){
        URL += pages + '.html'
      }

      return axios.post('/api/getNoAbsBooks',{url:URL}).then(res =>{
        return res
      }).catch(err => console.error(err))
    }
  }
});