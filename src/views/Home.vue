<template>
  <div class="home">
    <mt-popup
      v-model="popupVisible"
      position="bottom"
      popup-transition="popup-fade">
      {{ errMessage }}
    </mt-popup>

    <input v-model="API" type="text" placeholder="默认源">
    <br>
    <button type="submit" @click="changeS">源更改</button>
    <br>
    
    <input ref="In" v-model="Input" type="text" placeholder="输入书网址编号">
    <br>
    <button type="submit" @click="textInput">书籍ID确定</button>
    <br>
    <br>
    <!-- b         oo         k      s -->
    <div class="book-list" v-for="book in books" :key="book.time">
      <li style="background-color:#c9e4c6"  v-if="book.origin"> 

        <span v-if="book.origin">{{ book.origin }} - </span>

        <span> 
        <router-link :to="{ path: book.routeLink }"> {{ decodeURI(book.name) }} </router-link>
        </span>
        <!-- <span v-if="decodeURI(book.name)">   书名:   }</span> -->
        <br />
      </li>
    </div>
    <div v-if="isLoading"> Loading </div>
    <div v-else-if="books.length == 0">no book , please start your own books trip</div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapState } from "vuex"
import HelloWorld from "@/components/HelloWorld.vue";
import mergeUri from "@/util";
import URI from "urijs";


export default {
  name: "home",
  data() {
    return {
      Input: "2222",
      API:"",
      popupVisible:false,
      errMessage:""
    };
  },
  created(){
    this.$store.dispatch('getAllBooks').then(() =>{
      
    }).catch(err =>{
      this.errMessage = "添加 书籍 失败"
    })
  },
  computed:{
    ...mapState({
      books:(state) => state.books,
      isLoading:state => state.isHomeLoading
    })
  },
  mounted(){
    this.API = this.$store.state.Api
    this.$refs.In.focus()
  },
  methods: {
    textInput(){
      
      if(!this.Input){
        this.setErrMsg("请输入正确 书籍")
        return 
      }

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

      let fullUrl = this.$store.getters.getFullUrl(Input)

      this.$store.commit("setFullURL", fullUrl)

      return fullUrl
    },
    addJsonStore(url){
      return this.$store.dispatch('addJsonStore', url)
    },
    changeS(){
      let U = new URI(this.API)
      if(U.origin()){

        this.$store.commit("changeApi", U.origin())

      }else{
        this.setErrMsg('确定 源是 url')
      }
    },
    setErrMsg(msg){
        this.popupVisible = true
        this.errMessage = msg
    }
  },
  watch: {
    popupVisible:function(N){
      setTimeout(() =>{
        this.popupVisible = false
      },5000)
    }
  },
  components: {
    HelloWorld
  }
};
</script>

<style>

.book-list {
    text-align: left;
    border-bottom: 1px solid #efefef;
    text-indent: 10px;
    height: 40px;
    line-height: 40px;
    color: #999;
    overflow: hidden;
}
input {
  width: 80%
}
</style>

