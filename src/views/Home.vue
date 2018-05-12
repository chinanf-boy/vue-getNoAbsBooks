<template>
  <div class="home">
    <mt-popup
      v-model="popupVisible"
      position="top"
      popup-transition="popup-fade">
      添加 书籍 失败
    </mt-popup>

    <input v-model="API" type="text" placeholder="默认源">
    <br>
    <button type="submit" @click="changeS">源更改</button>
    <br>
    
    <input ref="In" v-model="Input" type="text" placeholder="输入书网址编号">
    <br>
    <button type="submit" @click="textInput">书籍路径确定</button>
    <br>
    <br>
    <!-- b         oo         k      s -->
    <div v-for="book in books" :key="book.time">
      <li style="background-color:#c9e4c6"  v-if="book.origin"> 
        <span v-if="book.origin">  来自:{{ book.origin }} </span>
        <span>
        目录: 
        <router-link :to="{ path: book.routeLink }"> {{ book.routeLink }} </router-link>
        </span>
        <span v-if="decodeURI(book.name)">   书名:   {{ decodeURI(book.name) }}</span>
        <br />
      </li>
    </div>
    <div v-if="books == null"> Loading </div>
    <div v-else>no book , please start your own books trip</div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapState } from "@/store"
import HelloWorld from "@/components/HelloWorld.vue";
import mergeUri from "@/util";
import URI from "urijs";


export default {
  name: "home",
  data() {
    return {
      books: null,
      Input: "2222",
      API:"",
      popupVisible:false
    };
  },
  created(){
    this.$store.dispatch('getAllBooks').catch(err =>{
      this.books = []
    })
  },
  mounted(){
    this.books = this.$store.state.books
    this.API = this.$store.state.Api
    this.$refs.In.focus()
  },
  methods: {
    textInput(){

      let fullUrl = this.getFull(this.Input)

      this.addJsonStore(fullUrl).catch(err =>{
        // error message show
        this.popupVisible = true
      })


      let uRI = new URI(fullUrl)

      if(uRI.suffix()){
        this.$store.commit('changeSuffix', uRI.suffix())
      }
      
      this.$router.push({ path:`${uRI.pathname()}`})
      
      },
    getFull(Input){
      return this.$store.getters.getFullUrl(Input)
    },
    addJsonStore(url){
      return this.$store.dispatch('addJsonStore', url)
    },
    changeS(){
      this.$store.commit("changeApi", this.API)
    }
  },
  watch: {
    popupVisible:function(N){
      setTimeout(() =>{
        this.popupVisible = false
      },1000)
    }
  },
  components: {
    HelloWorld
  }
};
</script>

<style>
input {
  width: 80%
}
</style>

