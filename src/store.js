import Vue from "vue";
import Vuex from "vuex";
import axios from "./http";
import URI from "urijs"
require('@/util')
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    books: [],
    Api: "http://m.76wx.com",
    suffix: "html",
    directory: "book"
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
  getters:{
    getFullUrl(state){
      return (Input) =>{
        let U = new URI(state.Api)

        Input = Input.trimStr('/') // trim /

        if(Input.startsWith(state.directory)){
          // ^[book]
          U.segmentCoded(Input)
        }else{
          //  [^book]
          U.directory(state.directory)
          U.segmentCoded(Input)
        }

        let fullUrl = U.href()
        return fullUrl
      }
    }
  },
  actions: {
    addJsonStore(state, url){
      return axios.post('/api/addJsonStore', {url}).then(res =>{
        console.log('add jsonstore',res.data.ok)
      })
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