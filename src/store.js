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
        let addS = ''
        if(Input.endsWith('/')){
          addS = '/'
        }
        Input = Input.trimStr('/') // trim /
        Input += addS
        
        if(Input.startsWith(state.directory)){
          // ^[book]
          U.segment(Input)
        }else{
          //  [^book]
          U.directory(state.directory)
          U.segment(Input)
        }
        
        // console.log(U.href())
        // U.href()
        // 1. http://example.org/book/123234/baz.html => book details
        // 2. http://example.org/book/123234/  => book index

        if(U.href().endsWith('/')){ 
          // 2
        // console.log('1', 2)
          
          return U.href()

        }
        if(U.suffix()){
      // console.log('1', 1)
          // 1
          return U.href()
        }
        // 3. http://example.org/book/123234/123234 => book details or book index
        // 4. http://example.org/book/123234 => book index
        // 5. http://example.org/book/123234/21342/2423443 => book details
        

        if(U.segment().length == 2){ // 4
      // console.log('1', 4)

          return U.href() + '/'
        }

        let fullUrl = U.suffix(state.suffix).href() // 5 + 3/2
      // console.log('1', 5)

        return fullUrl
      }
    }
  },
  actions: {
    addJsonStore(state, url){
      console.log('adding jsonstore',url)
      return axios.post('/api/addJsonStore', {url}).then(res =>{
        console.log('add jsonstore',res.data.ok)
      })
    },
    getAllBooks({
      commit
    }) {
      commit('clearBooks')
      
      return axios.get('/api/getAllBooks').then(res => {
        
        commit("addBooks", res.data.result)
      })
    },
    getBookIndex({
      commit, state, getters
    }, path ) {
      // console.log('path', path)

      let url = getters.getFullUrl(path)
      // console.log('url', url)
      // need html etc
      return axios.post('/api/getNoAbsBooks',{url}).then(res =>{
        return res
      })
    }
  }
});