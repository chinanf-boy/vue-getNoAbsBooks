<template>
  <div class="home">
    完整网址:
    <input v-model="fullURL" type="text" placeholder="www">
    <br>
    <br>
    <select v-model="apiSelected">
      <option disabled selected >{{ apiSelected }}</option>
      <option  v-for="site in API" :key="site" >{{ site }}</option>
    </select>
    <span v-if="apiSelected">
      <a :href="apiSelected" target="_blank">
        <button>👈进入看看</button>
      </a>
    </span>
    <br>
    <br>
    
    <input ref="In" @keyup.13="textInput" v-model="Input" type="text" placeholder="输入书网址编号">
    <br>
    <button type="submit" @click="textInput">👉 书籍ID确定</button>
    <br>
    
    <div class="books_span" v-if="bookTags.length">
      书签
        <ul style="margin:0;">
          <li class="book-list" v-for="tag in bookTags" :key="tag.id">
            <router-link :to="{path:tag.url}" class="book_link">
              <button type="submit" style="background-color:#c15a5a;overflow: hidden;">{{tag.title}}</button>
            </router-link>
            <br />
            <br />
          </li>
        </ul>
    </div>
    <br>

    <div class="books_span" v-if="books.length">
      书单
    </div>
    <!-- b         oo         k      s -->
    <ul v-if="!del">
    <li v-if="hideDelBook(book.name)"  class="book-list" v-for="book in books" :key="book.name">
      <!-- <span style="background-color:#c9e4c6;width:100%"  v-if="book.origin">  -->

        <router-link :to="{ path: book.url }" class="book_link" > 
          <button  class="home_book" type="submit" @click="setA(book.origin)">
            {{decodeURI(book.name)}}  
              {{ book.origin}} 
          </button>
        </router-link>
        <!-- <span v-if="decodeURI(book.name)">   书名:   }</span> -->
        <br />
    </li>    
    </ul>

<!-- del list -->
    <mt-checklist v-if="del" title="删除列表" align="right"
      v-model="delBookList"
      :options="getBookNameList()">

    </mt-checklist>

    <div v-if="isLoading" class="loading" >
      <mt-spinner type="triple-bounce" :size="60" color="#26a2ff">
      </mt-spinner>
    </div>
    
    <div style="border:1px red solid;" v-else-if="messageForUser && books.length == 0">
      Error: {{messageForUser}} 
    </div>


    <div v-else-if="books.length == 0">no book , please start your own books trip</div>

    <mt-switch  v-else  v-model="del" style="color:red;">删除</mt-switch>
<!-- del handle -->
    <div v-if="del">
      <br>
      <input @keyup.13="delBooks" type="text" class="pwd" placeholder="必须要密码" v-model="pwd">
      <button @click="delBooks">
        删除Go
      </button>
    </div>
    
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapState, mapGetters } from "vuex";
import HelloWorld from "@/components/HelloWorld.vue";
import URI from "urijs";

export default {
  name: "home",
  data() {
    return {
      Input: "2222/",
      apiSelected: "",
      pathName: "",
      pwd: "",
      del: false,
      delBookList: [],
      delOK: false
    };
  },
  metaInfo() {
    return {
      title: this.title
    };
  },
  created() {
    // 2
    // console.log("home created on",this.$route.path);
    this.$store.commit("setPendingLoad", this.$route.path);
    this.apiSelected = this.$store.state.apiSelected || this.API[0];

    // console.log("home created off");
  },
  computed: {
    fullURL: {
      get: function() {
        let U = new URI(this.apiSelected);

        if (this.pathName != "") {
          U.pathname(this.pathName);
        }

        // console.log("computed fullURL get", U.href()); // 3
        return U.href();
      },
      set: function(N) {
        // console.log("computed fullURL set", N);
        let U = new URI(N);
        this.apiSelected = U.origin();

        if (U.pathname() == "/") {
          this.pathName = "";
        } else {
          this.pathName = U.pathname();
        }
      }
    },

    ...mapState({
      // 1
      books: state => state.books,
      bookTags: state => state.bookTags,
      isLoading: state => state.isHomeLoading,
      API: state => state.Api,
      messageForUser: state => state.messageForUser,
      title: state => state.title
    })
  },
  mounted() {
    // console.log("Home mounted on");

    this.getBooks();

    this.changeInput(this.Input);

    this.$refs.In.focus();

    // console.log("Home mounted off");
  },
  methods: {
    ...mapActions(["showErrMessage", "syncApi", "getAllBooks", "delJsonStore"]),
    ...mapGetters(["getBookNameList"]),
    hideDelBook(name) {
      if (this.delOK) {
        let Del = this.delBookList.some(b => {
          return encodeURI(b) == name;
        });
        // console.log(name,Del)
        return !Del;
      }
      return true;
    },
    setA() {
      // console.log("book.origin set ApiSelected ", N);
      // this.syncApi(N);
    },
    getBooks() {
      // console.log("Home methods getBooks on");
      this.getAllBooks().catch(() => {
        // console.log("getAllBooks ❌", err.message);
      });
      // console.log("Home methods getBooks off");
    },
    textInput() {
      if (!this.Input) {
        this.showErrMessage("请输入正确 书籍");
        return;
      }

      let fullUrl = this.fullURL;
      this.$store.commit("setFullURL", this.fullURL);

      this.addJsonStore(fullUrl).then(() => {
        let uRI = new URI(fullUrl);

        if (uRI.suffix()) {
          this.$store.commit("changeSuffix", uRI.suffix());
        }
        // console.log("method textInput route to ", uRI.pathname());
        this.$router.push({ path: `${uRI.href()}` });
      });
    },
    getFull(Input) {
      let fullUrl = this.$store.getters.getFullUrl(Input);

      // console.log("method getFull", fullUrl);

      return fullUrl;
    },
    addJsonStore(url) {
      return this.$store.dispatch("addJsonStore", url);
    },
    changeS() {
      let U = new URI(this.API);
      if (U.origin()) {
        this.$store.commit("changeApi", U.origin());
      } else {
        this.showErrMessage("确定 源是 url");
      }
    },
    changeInput(In) {
      // console.log("methods changeInput");
      let fullUrl = this.getFull(In);
      // console.log("methods changeInput getURL");
      if (!In) {
        fullUrl = this.apiSelected;
      }

      let F = new URI(fullUrl);

      this.pathName = F.pathname();
    },
    delBooks() {
      let pwd = this.pwd;
      let delBookList = this.delBookList;
      this.delJsonStore({ pwd, delBookList }).then(ok => {
        if (ok) {
          this.delOK = true;
          this.del = false;
        }
      });
    }
  },
  watch: {
    apiSelected: function(N) {
      this.$store.commit("setApiSelected", N);
    },
    Input: function(N) {
      // console.log("watch Input");
      this.changeInput(N);
    }
  },
  components: {
    HelloWorld
  }
};
</script>

<style>
select {
  font-size: 1rem;
  height: 2rem;
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
.book_click {
  color: #fff;
  font-weight: normal;
}
.home_book {
  margin: 0;
  background-color: #93875f;
  border: 1px orange solid;
  padding: 0 1rem;
  font-size: 1rem;
  color: #fff;
  text-decoration: none;
  text-align: center;
  line-height: 3rem;
  height: 3rem;
  display: inline-block;
  appearance: none;
  cursor: pointer;
  border-top-color: currentcolor;
  box-sizing: border-box;
  transition-property: all;
  transition-duration: 0.3s;
}
.pwd {
  width: 50%;
  height: 1.4rem;
  font-size: 1.2rem;
}
input {
  width: 80%;
  font-size: 1rem;
}
</style>
