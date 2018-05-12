<template>
  <div class="home">
    <mt-popup
      v-model="popupVisible"
      position="top"
      popup-transition="popup-fade">
      获取 书 失败
    </mt-popup>

    <input v-model="API" type="text" placeholder="默认源">
    <button type="submit" @click="changeS">源更改</button>
    <img src="../assets/logo.png">
    
    <input v-model="Input" type="text" placeholder="输入书网址编号">
    <button type="submit" @click="textInput">确定</button>
        <br>
    <br>
    <!-- b         oo         k      s -->
    <div v-for="book in books" :key="book.id">
      <li style="background-color:#c9e4c6"  v-if="book.routeLink"> 
        <span v-if="book.origin">  来自:{{ book.origin }} </span>
        <span>
        目录: 
        <router-link :to="{ path: book.routeLink }"> {{ book.routeLink }} </router-link>
        </span>
        <span v-if="book.name">   书名:   {{ book.name }}</span>
        <br />
      </li>
    </div>
    <div v-if="!books.length">Loading</div>
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
      books: [],
      Input: "2222",
      API:"",
      popupVisible:false
    };
  },
  created(){
    this.$store.dispatch('getAllBooks').catch(console.error)
  },
  mounted(){
    this.books = this.$store.state.books
    this.API = this.$store.state.Api
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

