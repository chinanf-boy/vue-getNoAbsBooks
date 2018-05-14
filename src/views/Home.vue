<template>
  <div class="home">
    <mt-popup
      v-model="popupVisible"
      position="bottom"
      popup-transition="popup-fade">
      {{ errMessage }}
    </mt-popup>
    完整网址:
    <input v-model="fullURL" type="text" placeholder="www">
    <br>
    <br>
    <select v-model="apiSelected">
      <option disabled selected >{{ apiSelected }}</option>
      <option  v-for="site in API" :key="site" >{{ site }}</option>
    </select>
    <br>
    <br>
    
    <input ref="In" v-model="Input" type="text" placeholder="输入书网址编号">
    <br>
    <button type="submit" @click="textInput">书籍ID确定👉 </button>
    <br>
    <br>
    <div class="books_span" v-if="books.length">
      Books
    </div>
    <!-- b         oo         k      s -->
    <ul>
    <li  class="book-list" v-for="book in books" :key="book.time">
      <!-- <span style="background-color:#c9e4c6;width:100%"  v-if="book.origin">  -->

        <router-link :to="{ path: book.routeLink } " tag="span" class="book_link" > 
          <button class="home_book" type="submit" @click="setA(book.origin)">
            {{decodeURI(book.name)}}  <span class="book_origin" v-if="book.origin"> {{ book.origin}} </span>
          </button>
           </router-link>
        <!-- <span v-if="decodeURI(book.name)">   书名:   }</span> -->
        <br />
    </li>
    </ul>
    <div v-if="isLoading" class="loading" >
      <mt-spinner type="triple-bounce" :size="60" color="#26a2ff">
        </mt-spinner>
        </div>
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
      Input: "2222/",
      popupVisible:false,
      errMessage:"",
      apiSelected:"",
      pathName:""
    };
  },
  created(){ // 2
    console.log('set apiSelected',this.API)
    this.apiSelected = this.API[0]
    this.$store.commit("setApiSelected", this.API[0])
    
    this.$store.dispatch('getAllBooks').then(() =>{
      
    }).catch(err =>{
      this.errMessage = "添加 书籍 失败"
    })
  },
  computed:{
    fullURL:{
      get:function(){
        console.log('computed fullURL') // 3
        let U = new URI(this.apiSelected)

        if(this.pathName != ''){
          U.pathname(this.pathName)
        }
        
        return U.href()
      },
      set:function(N){
          console.log('computed set fullURL',N)
          let U = new URI(N)
          this.apiSelected = U.origin()

          if(U.pathname() == '/'){
            this.pathName = ""
          }else{
            this.pathName = U.pathname()          
          }
      }
    },

    ...mapState({ // 1
      books:(state) => state.books,
      isLoading:state => state.isHomeLoading,
      API:state => state.Api
    })
  },
  mounted(){
    console.log('m1')
    this.getApiSelected()
    console.log('m2')
    this.changeInput()
    console.log('m3')
    this.$refs.In.focus()
  },
  methods: {
    setA(N){
      console.log('book.origin set ApiSelected ',N)
      this.$store.commit("setApiSelected", N)
    },
    getApiSelected(){
      console.log('getApiSelected')
      
    },
    textInput(){
      
      if(!this.Input){
        this.setErrMsg("请输入正确 书籍")
        return 
      }

      let fullUrl = this.fullURL
      this.$store.commit("setFullURL", this.fullURL)
      this.addJsonStore(fullUrl).catch(err =>{
        // error message show
        this.popupVisible = true
      })


      let uRI = new URI(fullUrl)

      if(uRI.suffix()){
        this.$store.commit('changeSuffix', uRI.suffix())
      }
      console.log('method textInput route to ',uRI.pathname())
      this.$router.push({ path:`${uRI.pathname()}`})
      
      },
    getFull(Input){

      let fullUrl = this.$store.getters.getFullUrl(Input)

      console.log('method getFull',fullUrl)

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
    },
    changeInput(){
      console.log('methods changeInput')
      let fullUrl = this.getFull(this.Input)
      console.log('methods changeInput getURL')
      if(!this.Input){
        fullUrl = this.apiSelected
      }

      let F = new URI(fullUrl)

      this.pathName = F.pathname()
    }
  },
  watch: {
    popupVisible:function(N){
      setTimeout(() =>{
        this.popupVisible = false
      },5000)
    },
    apiSelected:function(N){
      this.$store.commit("setApiSelected", N)
    },
    Input:function(N){
      console.log('watch Input')
      this.changeInput()
    }
  },
  components: {
    HelloWorld
  }
};
</script>

<style>
select {
  height: 1.5rem;
  border: 1px grey solid;
}
.books_span {
  border: 1px orange solid;
  background-color: #999;
}
.book-list {
    /* text-align: left; */
    border-bottom: 1px solid #efefef;
    text-indent: 0.6rem;
    height: 3rem;
    line-height: 3rem;
    color: #999;
    margin-right: 1rem;
}
.book_origin {
  width: 49%;
  overflow: hidden;
}
.book_link {
  width: 49%;
  overflow: hidden;
}
.home_book {
  margin: 0;
  background-color: #93875F;
  font-weight: bold;
  border:1px orange solid;
  padding: 0 1rem;
}
input {
  width: 80%
}
</style>

