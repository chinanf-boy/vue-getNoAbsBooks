import Vue from "vue";
import Vuex from "vuex";
import axios from "./http";
import URI from "urijs";
require("@/util");
Vue.use(Vuex);

import { Indicator,Toast } from 'mint-ui';
import localforage from "localforage";

let Toast4 = function Toast4(str){
  Toast({
    message: str,
    iconClass: 'icon icon-success',
    duration: 400
  });
}

export default new Vuex.Store({
  state: {
    // App
    isBlockLoading: false,
    errMessage: "",
    pendingLoad: "",
    // Home
    books: [],
    bookTags: [],
    Api: ["http://m.zwdu.com", "http://m.76wx.com"],
    apiSelected: "",
    suffix: "html",
    directory: "book",
    fullURL: "",

    // Index
    HTML: "",
    title: "无广告的书-yobrave",
    isIndexLoading: false,
    messageForUser: "",
    autoRead: false,
    autoTime: 10,
    // status
    isHomeLoading: false
  },
  mutations: {
    // App
    clearBooks(state) {
      state.books = [];
    },
    clearBookTags(state){
      state.bookTags = [];
    },
    setBlockLoading(state, bool) {
      state.isBlockLoading = bool;
    },
    setPendingLoad(state, str) {
      // console.log("mutations:setPendingLoad", str);
      if (state.pendingLoad != str) {
        state.pendingLoad = str;
      }
    },
    setErrMessage(state, err) {
      // console.log("mutations setErrMessage on");
      state.errMessage = err;
      // console.log("mutations setErrMessage off");
    },
    // Home
    setFullURL(state, str) {
      state.fullURL = str;
    },
    setApiSelected(state, str) {
      // console.log("mutations:setApiSelected", str);
      state.apiSelected = str;
    },
    setHomeLoading(state, bool) {
      state.isHomeLoading = bool;
    },
    addBooks(state, data) {
      Object.keys(data).forEach(bookName => {
        state.books.push(data[bookName]);
      });
    },
    addBookTags(state, data) {
      Object.keys(data).forEach(tag => {
        state.bookTags.push(data[tag]);
      });
    },
    changeApi(state, data) {
      state.Api = data;
    },
    changeSuffix(state, data) {
      state.suffix = data;
    },
    // Index
    setHtml(state, h) {
      state.HTML = h;
    },
    setTitle(state, t) {
      state.title = t;
    },
    setAutoRead(state, r) {
      state.autoRead = r;
    },
    setAutoTimer(state, t) {
      state.autoTime = t;
    },
    setIndexLoading(state, bool) {
      state.isIndexLoading = bool;
    },
    setMessageForUser(state, h) {
      state.messageForUser = h;
    }
  },
  getters: {
    //
    getBookNameList(state){
      return state.books.map(book =>decodeURI(book.name))
    },
    getFullUrl(state) {
      return Input => {
        let U = new URI(state.apiSelected);
        let addS = "";
        if (Input.endsWith("/")) {
          addS = "/";
        }
        Input = Input.trimStr("/"); // trim /
        // console.log("getter getFUll Input", Input);

        U.directory(state.directory);
        U.segment(Input);
        if (U.segment().length == 2) {
          // 4
          // // console.log('1', 4)
          if (addS && !U.href().endsWith("/")) {
            U.segment(addS);
            addS = "";
          } else if (!U.suffix() && U.filename()) {
            U.suffix(state.suffix);
          }
          return U.href();
        }
        // // console.log(U.href())
        // U.href()
        // 1. http://example.org/book/123234/baz.html => book details
        // 2. http://example.org/book/123234/  => book index
        // 3. http://example.org/book/123234/123234 => book details or book index
        // 4. http://example.org/book/123234 => book index
        // 5. http://example.org/book/123234/21342/2423443 => book details

        // console.log("getter getFUll", U.href());

        U.pathname(Input);

        if (addS && !U.href().endsWith("/")) {
          U.segment(addS);
          addS = "";
        } else if (!U.suffix() && U.filename()) {
          U.suffix(state.suffix);
        }

        return U.href();
      };
    }
  },
  actions: {
    // App
    axiosWithCancel: async function({ state },{ method, path, postForm, options }) {
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      options = {
        cancelToken: source.token
      };
      return new Promise((ok, bad) => {
        let T = 1;
        let thisTimePending = state.pendingLoad;

        axios[method](path, postForm, options)
          .then(res => {
            T = null;
            ok(res);
          })
          .catch(thrown => {
            T = null;
            if (axios.isCancel(thrown)) {
              bad("Request canceled " + thrown.message);
            } else {
              bad(thrown);
            }
          });

        let N = function() {
          setTimeout(() => {
            // console.log("axiosWithCancel run run run",state.pendingLoad,postForm.url);
            if (state.pendingLoad !== thisTimePending) {
              // console.log("Operation canceled 自己会说一次");
              source.cancel("Operation canceled by the user.");
              T = null;
            } else if (T) {
              N();
            }
          }, 66);
        };

        N();
      });
    },
    initApiSelected: async function({ commit, state }) {
      // console.log("action initApiSelected on");

      let api = await localforage.getItem("user-apiselected");

      if (api) {
        commit("setApiSelected", api);
      } else {
        commit("setApiSelected", state.Api[0]);
      }

      // console.log("action initApiSelected off");
    },
    syncApi: async function({ commit }, a) {
      // console.log("action syncApi on", a);
      commit("setApiSelected", a);
      localforage.setItem("user-apiselected", a);
      // console.log("action syncApi off", a);
    },
    showErrMessage: function({ commit }, errMessage) {
      if (errMessage) {
        commit("setBlockLoading", true);

        commit("setErrMessage", errMessage);

        setTimeout(function(){

          commit("setBlockLoading", false);

          commit("setErrMessage", "");

        },1300)

        commit("setMessageForUser", errMessage);
      }
    },
    // Home
    addJsonStore:async function({dispatch}, url) {
      // console.log("adding jsonstore", url);
      try{

        Indicator.open("正在加入书单")
        let res =  await axios.post("/api/addJsonStore", { url })
        return res

      }catch(e){
        // console.log('addJsonStore error')
        dispatch("showErrMessage", "无法被加入书单\n"+e);
        throw new Error(e);  
              
      }finally{
        Indicator.close()
      }

    },
    delJsonStore: async function({dispatch},delBooks) {
      try{
        // console.log('delJsonStore start',delBooks)
        Indicator.open("正在删除")
        
        let pwd = delBooks.pwd
        let delBookList  = delBooks.delBookList
        let res
        if(delBookList.length){
          for(let bname of delBookList){
            let name = encodeURI(bname);
            Indicator.open(`正在删除-${bname}`)
            res = await axios.post("/api/deleteJsonStore", { name, pwd })
          };
        }
        Toast4("删除 成功")
        return res
        // console.log('delJsonStore end')        
      }catch(err){
        dispatch("showErrMessage", "无法删除书单\n"+err.message);
        // throw new Error(err);  
      }finally{
        setTimeout(() => {
          Indicator.close()
        }, 300);
      }

    },
    delBookTag: async function({dispatch},delBooks) {
      try{
        // console.log('delBookTag start',delBooks)
        Indicator.open("正在删除")
        
        let delBookList  = delBooks.delBookList
        let res
        if(delBookList.length){
          for(let bname of delBookList){
            let name = encodeURI(bname);
            Indicator.open(`正在删除-${bname}`)
            res = await axios.post("/api/delBookTag", { title:name })
          };
        }
        
        Toast4("删除 成功")

        return res
        // console.log('delBookTag end')        
      }catch(err){
        dispatch("showErrMessage", "无法删除书签\n"+err.message);
        // throw new Error(err);  
      }finally{
        setTimeout(() => {
          Indicator.close()
        }, 300);
      }

    },
    getAllBooks: async function({ commit, dispatch }) {
      // console.log("actions getAllBooks on");

      commit("setHomeLoading", true);

      commit("clearBooks");
      commit("clearBookTags");


      let result;
      try {
        result = await axios.get("/api/getAllBooks").then(res => {
          commit("addBooks", res.data.result.books || []);
          commit("addBookTags", res.data.result.booktags || []);
        });
      } catch (e) {
        dispatch("showErrMessage", e.message);
        throw new Error(e);
      } finally {
        commit("setHomeLoading", false);
        // console.log("actions getAllBooks off");
      }

      return result;
    },
    // Index
    addActBookTags:async function({dispatch}, {url, title}) {
      // console.log("adding jsonstore", url);
      try{

        Indicator.open(`正在添加书签${title}`)
        let res =  await axios.post("/api/addBookTags", { url,title })
        Toast4("添加 成功")
        return res

      }catch(e){
        // console.log('addJsonStore error')
        dispatch("showErrMessage", "无法被加入书签\n"+e);
        throw new Error(e);  
      }finally{
        Indicator.close()
      }

    },
    initFontSize: async function({ commit, state }) {
      // console.log("action keepHTML on", state.fullURL);
      let fontSize =
      (await localforage.getItem('user-fontsize')) ||
      +window.getComputedStyle(document.body)['font-size'].replace('px', '');
      
      document.querySelector('body').style.fontSize = fontSize + 'px';

      await localforage.setItem('user-fontsize', fontSize);
      // console.log("action keepHTML off");
    },
    keepHTML: async function({ commit, state }, html) {
      // console.log("action keepHTML on", state.fullURL);
      await localforage.setItem(`${state.fullURL}`, html);
      commit("setHtml", html);
      // console.log("action keepHTML off");
    },
    copyHTML: async function({ state }) {
      // console.log("action copyHTML on", state.fullURL);
      let H = await localforage.getItem(`${state.fullURL}`);
      // console.log("action copyHTML off");
      return H;
    },
    removeHTML:async function({state}){
      await localforage.removeItem(`${state.fullURL}`)
    },
    getBookIndex: async function({ commit, state, dispatch }, path) {
      commit("setIndexLoading", true);

      // if(path !== state.pendingLoad) return

      if (path.startsWith("/")) {
        let mayFULLURL = path.substring(1);
        let url = new URI(mayFULLURL);
        if (url.origin()) {
          path = mayFULLURL;
        }
      }

      let url = new URI(path);

      // console.log("actions getBookIndex on", url.href());

      // set origin to ApiSelected on
      if (url.origin()) {
        // fullurl just no action
        dispatch("syncApi", url.origin());
        // console.log("getBookIndex syncApi set 👇");
      }

      if (!state.apiSelected) {
        // console.log("getBookIndex syncApi set 👆");
        await dispatch("initApiSelected");
      }
      // set origin to ApiSelected off

      // console.log("setFullURL before", state.fullURL);

      let newFullurl;
      if (url.origin()) {
        newFullurl = url;
      } else {
        newFullurl = url.origin(state.apiSelected);
      }
      commit("setFullURL", newFullurl.href()); // change fullURL

      // console.log("setFullURL after", state.fullURL);

      // get newFullurl

      let result;
      let urlPathLen = newFullurl.segment().length;
      let fileSuffix = newFullurl.suffix();
      let fileName = newFullurl.filename();
      let file = !!(fileSuffix && !fileName.includes("index_"));

      url = newFullurl.href();

      // console.log("getBookIndex before", url);

      let notUserAction = true;

      try {
        if ((file || urlPathLen > 3) && (await localforage.getItem(`${url}`))) {
          // console.log("copyHTML", fileSuffix, urlPathLen, url);
          result = await dispatch("copyHTML");
        } else {
          commit("setHtml", "");
          result = await dispatch("axiosWithCancel", {
            method: "post",
            path: "/api/getNoAbsBooks",
            postForm: { url }
          });
        }

        if (result && !result.data) {
          let R = {};
          R.data = result;
          R.status = 200;
          result = R;
        }

        // console.log("getBookIndex after", result.data);
        await dispatch("keepHTML", result.data);

      } catch (e) {
        commit("setHtml", "");

        notUserAction = !!e.message;

        if(notUserAction){
          dispatch("showErrMessage", e.message);
        }

        // Fix: Error html nothing
        throw new Error(e);
      } finally {
        if (notUserAction) {
          commit("setIndexLoading", false);
      }

      return result;

        // console.log("actions getBookIndex off");
      }
    }
  }
});
