<template>
  <div class="home">
    <div v-html="toHTML"></div>
    <img src="../assets/logo.png">
    <div v-for="book in books" :key="book.id">
      <li>      
        <router-link to="{ name: 'BookIndex', params: {id: book.id}}"> {{ book.url }} </router-link>
        <span>{{ book.name }}</span>
      </li>
    </div>
    <select name="pageselect" v-model="selected"  multiple style="width: 50%;">
      <option value="index_1">第0章 - 第20章</option>
      <option value="index_2">第20章 - 第40章</option>
      <option value="index_3">第40章 - 第60章</option>
      <option value="index_4">第60章 - 第80章</option>
    </select>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <span>{{ selected }}</span>
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
      toHTML: `<div>hahah
      <a href="#/about.html">about</a>
      </div>`,
      selected: [],
      books: []
    };
  },

  created(){
    this.$store.dispatch('getAllBooks')
  },
  mounted(){
    this.books = this.$store.state.books
  },
  methods: {
    // ...mapActions(['getAllBooks']),
    onChange(indexPage) {
      let Op = this.$route.path;
      let indexFull = mergeUri(Op, indexPage);
      this.$router.push({ path: indexFull });
      console.log(indexFull);
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
