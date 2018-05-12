<template>
  <div class="home">
    <input v-model="API" type="text" placeholder="默认源">
    <button type="submit" @click="changeS">源更改</button>
    <img src="../assets/logo.png">
    
    <input v-model="Input" type="text" placeholder="输入书网址编号">
    <button type="submit" @click="textInput">确定</button>
        <br>
    <br>
    <div v-for="book in books" :key="book.id">
      <li style="background-color:#c9e4c6"> 
        <span v-if="book.source">  来自:{{ book.api }} </span>
        目录: 
        <router-link :to="{name: 'BookIndex', params: {id: book.id}}"> {{ book.url }} </router-link>
        书名:   
        <span> {{ book.name }}</span>
      </li>
        <br />
    </div>
    <div v-if="!books.length">Loading</div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapState } from "@/store"
import HelloWorld from "@/components/HelloWorld.vue";
import mergeUri from "@/util";

export default {
  name: "home",
  data() {
    return {
      books: [],
      Input: "2222",
      API:""
    };
  },
  created(){
    this.$store.dispatch('getAllBooks')
  },
  mounted(){
    this.books = this.$store.state.books
    this.API = this.$store.state.Api
  },
  methods: {
    textInput(){
      console.log(typeof this.Input)
      try{
        let ok = this.Input / 1
      }catch(err){
        return 
      }   
      this.addJsonStore(this.Input)
      let uRI = `/book/${this.Input}`
      this.$router.push({ path:`${uRI}`})
      console.log(1)
      
      },
    addJsonStore(id){
      this.$store.dispatch('addJsonStore', id)
    },
    changeS(){
      this.$store.commit("changeApi", this.API)
    }
  },
  watch: {
    selected: function(newState) {
      this.onChange(newState);
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

