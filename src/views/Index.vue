<template>
  <div class="container" id="container">
    <!-- fontsize -->
      
    <!-- auto read -->
    <auto-reader></auto-reader>
      
    <div class="book" id="book-top">
      <div class="cover_BOOK" ref="getHtml" >
        <!-- book HTML body-->
        <div v-html="HTML">
        </div>
        <!-- Up top -->
        <div v-if="HTML" class="up-top" id="bottom">       
            <a @click="scrollTop(1)" id="up-top" style="color:#038ef7;display:block;">Up top</a>
        </div>
        <!-- remove cache and reFlash -->
            <div v-if="HTML" >       
                  <button v-if="reLoad" @click="hardReFlash">重刷新</button>
                  <mt-spinner v-else type="triple-bounce" :size="60" color="#26a2ff">
                    </mt-spinner>
            </div>
      </div>
    </div>
    
  <!-- require info -->
   <div v-if="isLoading">
      请求 
      <br>  
      source: {{apiSelected}}
      <br>
      {{urlPath}}
        <mt-spinner type="triple-bounce" :size="60" color="#26a2ff">
        </mt-spinner>
    </div>

    <div v-else-if="errMessage"  class="loading" >
      {{errMessage}}
    </div>

  <!-- error info -->
    <div v-else-if="HTML=='' && messageForUser"> 
      请求 失败
      <br>  
    <div style="border:1px orange solid;">
      {{apiSelected}}
      <br>
      {{path}}
      <br>
      {{messageForUser}}
    </div>
      <br>
      如果你认为这个错误是个bug 
      <br> 
    <a style="color:red;" href="http://github.com/chinanf-boy/vue-getNoAbsBooks">
      👉 提交bug</a> 
      <br>
      <button v-if="reLoad" @click="reFlash">刷新</button>
      <mt-spinner v-else type="triple-bounce" :size="60" color="#26a2ff">
        </mt-spinner>
    </div>
    
 

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import debounce from "lodash.debounce";
import autoReader from "@/components/autoRead.vue";
import fontSize from "@/components/fontSize.vue";

export default {
  name: "BookIndex",
  components: {
    autoReader,
    fontSize
  },
  data: function() {
    return {
      path: "",
      bookName: "",
      reLoad: true
    };
  },
  metaInfo() {
    return {
      title: this.title
    };
  },
  computed: {
    ...mapState({
      errMessage: state => state.errMessage,
      fullurl: state => state.fullURL,
      apiSelected: state => state.apiSelected,
      HTML: state => state.HTML,
      isLoading: state => state.isIndexLoading,
      messageForUser: state => state.messageForUser,
      title: state => state.title,
      autoRead: state => state.autoRead
    }),

    urlPath: function() {
      if (this.path.includes(this.apiSelected)) {
        return this.path.slice(this.apiSelected.length + 1);
      }
      return this.path;
    }
  },
  mounted() {
    // console.log("Index mounted on");
    this.getPath();
    this.initFontSize()
    // console.log("Index mounted off");
  },
  created() {
    this.$store.commit("setAutoRead", false);
    // Fix once autoRead
    this.$store.commit("setHtml", ""); // Fix ole muen
    /* eslint-disable */
    this.$router.afterEach((to, from) => {
      // console.log("run router", to.path);
      if(this.autoRead){
        // console.log('up Click',this.autoRead,document.getElementById("up-top"))
        let top = document.getElementById("up-top")
        top && top.click()
      }
      this.setIndexLoading(true); // we must show the user, app running quickly
      this.setHtml("")
      this.setBlockLoading(false);

      // need to get time
      // console.log("Index methods getPath 2222");

      this.getPath();

      // this.path = to.path; // 给 watch 启动启动
      // console.log("run router set", this.fontSize, this.setFont);
    });
  },
  methods: {
    ...mapMutations(["setBlockLoading", "setPendingLoad", "setIndexLoading", "setTitle", "setHtml"]),
    ...mapActions(["showErrMessage", "getBookIndex","removeHTML","initFontSize"]),
    getPath() {
      // console.log("Index methods getPath on");
      this.path = this.$route.path;
      // console.log("Index methods getPath off");
    },
    scrollTop(ms){
      this.$scrollTo("#container",ms)
    },
    addLoad(ing) {
      // console.log("Index methods addLoad on");

      this.setPendingLoad(ing);

      this.getBookPage();
      // console.log("Index methods addLoad off");
    },
    getBookPage: debounce(
      function() {
        // console.log("Index methods getBookPage on", this.apiSelected, this.path);
        // console.log("Index watch path on 1111");
        this.getBookIndex(this.path)
          .then(res => {
            // console.log(" Index getBookPage result =>", res);
            let T = 0;
            waitChapter = waitChapter.bind(this);
            waitChapter(false)
            function waitChapter(okHTML) {
              if(document.querySelector('.book h1') && !okHTML){  
                
                // Add document.title
                let bname = document.querySelector('.book h1')
                let bchapter = document.getElementById("nr_title")

                if(bname && bchapter){
                  this.setTitle(bname.textContent +' > '+bchapter.textContent)
                  
                }else if(bname){
                  this.setTitle(bname.textContent)
                }
                
                if(this.autoRead){
                  // console.log('new page, autoRead')
                  window._startAutoRead && window._startAutoRead(this.autoRead)

                }else{
                  // console.log('new page, stop')
                  
                }

                okHTML = true
              }

              if (document.getElementsByClassName("chapter").length > 0) {
                // in phone HTML != document is no sync， there have time less

                let ul1 = document.getElementsByClassName("chapter");

                let ul = Array.from(ul1);

                ul.forEach(x => {
                  x.style.display = "";
                });
                // console.log("getBookPage HTML ✅", ul1);
              } else {
                // console.log(`getBookPage HTML put the document is no sync,there have time less in phone ` + T);

                if (T < 3) {
                  T++;
                  setTimeout(function(){waitChapter(okHTML)}, 1);
                } else {
                  // throw new Error("o see like error HTML")
                }
              }


            }

          })
          .catch(err => {
            // console.log("getBookPage ❌", err);
          });
        // console.log("Index methods getBookPage off",this.apiSelected,this.path);
      },
      100,
      {
        trailing: true
      }
    ),
    reFlash(){
      this.reLoad = false
      // console.log('reload before')
      setTimeout(() => {
        // console.log('reload')
        location.reload();
      }, 30);
    },
    hardReFlash(){
      this.removeHTML()
      this.reFlash()
    }

  },
  beforeDestroy(){
    this.setTitle("无广告的书-yobrave")
  },
  watch: {
    path: function(N) {
      // console.log("Index watch path on");
      this.addLoad(N);
      // console.log("Index watch path off");
    }
  }
};
</script>

<style scoped>
.container {
  /* position: relative; */
}
.cover_BOOK {
  margin: auto 1rem auto 1rem;
}
.up-top {
    margin: 1rem;
    border-radius: 20%;
    border: #544444 2px solid;
    padding-left: 1.3rem;
    padding-right: 1.3rem;
    background-color: gold;
    
}
</style>
