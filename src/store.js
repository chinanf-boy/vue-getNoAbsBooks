import Vue from "vue";
import Vuex from "vuex";
import axios from "./http";
import URI from "urijs"
require('@/util')
Vue.use(Vuex);

import localforage from 'localforage'


export default new Vuex.Store({
  state: {
    // App
    isBlockLoading:false,
    errMessage:"",
    // Home
    books: [],
    Api: ["http://m.76wx.com","http://m.zwdu.com"],
    apiSelected:"",
    suffix: "html",
    directory: "book",
    fullURL: '',
    
    // Index
    HTML:"",
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
      console.log('mutations:setApiSelected',str)
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
    setHtml(state, h){
      state.HTML = h
    },
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
    initApiSelected: async function({commit,dispatch}){
      console.log("action initApiSelected on")
      
      let api = await localforage.getItem("user-apiselected")

      if(api){
        commit("setApiSelected", api)
      }
      
      console.log("action initApiSelected off")
      
    },
    syncApi: async function({commit}, a){
      console.log("action syncApi on",a)
      commit("setApiSelected",a)
      localforage.setItem("user-apiselected",a)
      console.log("action syncApi off",a)
    },
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
      console.log('actions getAllBooks on')
      
      commit('setHomeLoading', true)

      commit('clearBooks')

      let result
      try{

         result = await axios.get('/api/getAllBooks').then(res => {
          commit("addBooks", res.data.result)
          })

      }catch(e){

        dispatch("showErrMessage",e.message)
        throw new Error(e)

      }finally{
        commit('setHomeLoading', false)

        console.log('actions getAllBooks off')
      }
      

      return result
      
    },
    // Index
    keepHTML:async function({commit,state},html){
      console.log("action keepHTML on",state.fullURL)
      await localforage.setItem(`${state.fullURL}`,html)
      commit("setHtml",html)
      console.log("action keepHTML off")
    },
    copyHTML:async function({commit,state}){
      console.log("action copyHTML on",state.fullURL)
      let H = await localforage.getItem(`${state.fullURL}`)
      commit("setHtml",H)
      console.log("action copyHTML off")
      return H
    },
    getBookIndex:async function({
      commit, state, getters, dispatch
    }, path ) {


      console.log('actions getBookIndex on',state.apiSelected)

      commit("setIndexLoading",true)

      if(!state.apiSelected){
        await dispatch("initApiSelected")
      }
      
      let url = new URI(state.apiSelected)
      // just merge
      url.pathname(path)
      
      console.log('getBookIndex',url.href())
      
      commit("setFullURL", url.href()) // change fullURL
      

      // console.log('url', url)
      // need html etc
      url = url.href()
      
      let result
      console.log("getBookIndex before",url)

      try{

        if(await localforage.getItem(`${url}`)){
          result = await dispatch("copyHTML")
        }else{
          commit("setHtml",'')
          result = await axios.post('/api/getNoAbsBooks',{url})
        }

      }catch(e){
  
        dispatch("showErrMessage",e.message)
        throw new Error(e)

      }finally{
        console.log("getBookIndex after",result.length)
        commit("setIndexLoading",false)
        console.log('actions getBookIndex off')
      }

      if(result.data){
        await dispatch("keepHTML",result.data)
      }


      
      return result
    }
  }
});