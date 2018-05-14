import Vue from "vue";
import Vuex from "vuex";
import axios from "./http";
import URI from "urijs"
require('@/util')
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // App
    isBlockLoading:false,
    errMessage:"",
    // Home
    books: [],
    Api: ["http://m.76wx.com","http://m.zwdu.com"],
    apiSelected:"http://m.76wx.com",
    suffix: "html",
    directory: "book",
    fullURL: '',
    
    // Index
    isIndexLoading:false,
    // status
    isHomeLoading:false
  },
  mutations: {
    // App
    clearBooks(state) {
      state.books = []
    },
    setBlockLoading(state, bool){
      state.isBlockLoading = bool
    },
    setErrMessage(state, err){
      state.errMessage = err
    },
    // Home
    setFullURL(state, str){
      state.fullURL = str
    },
    setApiSelected(state, str){
      console.log('mutations:setApiSelected')
      state.apiSelected = str
    },
    setHomeLoading(state, bool){
      state.isHomeLoading = bool
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
    // Index
    setIndexLoading(state, bool){
      state.isIndexLoading = bool
    },
  },
  getters:{

    // 
    getFullUrl(state){
      return (Input) =>{
        let U = new URI(state.apiSelected)
        let addS = ''
        if(Input.endsWith('/')){
          addS = '/'
        }
        Input = Input.trimStr('/') // trim /
        console.log('getter getFUll Input',Input)
        
        U.directory(state.directory)
        U.segment(Input)
        if(U.segment().length == 2){ // 4
          // console.log('1', 4)
            if(addS && !U.href().endsWith('/')){
              U.segment(addS)
              addS = ""
            }else if(!U.suffix()){
              U.suffix(state.suffix)
            }
            return U.href()
        }
        // console.log(U.href())
        // U.href()
        // 1. http://example.org/book/123234/baz.html => book details
        // 2. http://example.org/book/123234/  => book index
        // 3. http://example.org/book/123234/123234 => book details or book index
        // 4. http://example.org/book/123234 => book index
        // 5. http://example.org/book/123234/21342/2423443 => book details
        
        console.log('getter getFUll',U.href())



        U.pathname(Input)


        if(addS && !U.href().endsWith('/')){
          U.segment(addS)
          addS = ""
        }else if(!U.suffix()){
          U.suffix(state.suffix)
        }

        return U.href()
        
      }
    }
  },
  actions: {
    // App
    showErrMessage: async function({commit, dispatch}, errMessage){
      if(errMessage){
        commit("setBlockLoading", true)
  
        commit("setErrMessage", errMessage)
  
        await dispatch("waitTime", 3000)
  
        commit("setBlockLoading", false)
        
        commit("setErrMessage", "")
      }
    },
    waitTime: async function({commit},time){
      await new Promise((ok,bad) =>{
        try{
          setTimeout(ok, time)
        }catch(e){
          bad(e)
        }
      })
    },
    // Home
    addJsonStore(state, url){
      console.log('adding jsonstore',url)
      return axios.post('/api/addJsonStore', {url}).then(res =>{
        console.log('add jsonstore',res.data.ok)
      })
    },
    getAllBooks:async function({
      commit
    }) {
      commit('setHomeLoading', true)

      commit('clearBooks')
      
      let result = await axios.get('/api/getAllBooks').then(res => {
        commit("addBooks", res.data.result)
      })

      commit('setHomeLoading', false)
      
      console.log('getAllBooks done')

      return result
      
    },
    // Index
    getBookIndex:async function({
      commit, state, getters,dispatch
    }, path ) {

      commit("setIndexLoading",true)

      console.log('actions apiSelected',state.apiSelected)
      
      let url = new URI(state.apiSelected)
      // just merge
      url.pathname(path)
      
      console.log('getBookIndex',url.href())
      
      commit("setFullURL", url.href())
      // console.log('url', url)
      // need html etc
      url = url.href()
      
      console.log("getBookIndex before",url)
      let result
      try{

        result = await axios.post('/api/getNoAbsBooks',{url})

      }catch(e){
  
        dispatch("showErrMessage",e.message)
        throw new Error(e)

      }finally{
        console.log("getBookIndex after",result)
        commit("setIndexLoading",false)
      }

      return result
    }
  }
});