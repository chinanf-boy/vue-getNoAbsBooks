<template>
  <div class="container" id="container">
    <!-- fontsize -->
    <div v-if="HTML">
      <div v-if="fontSize">
      字体大小 {{ fontSize }}
      <br>
      <mt-range
      v-model="fontSize"
      :min="13"
      :max="25"
      :step="1"
      :bar-height="5">
      </mt-range>
      </div>
      </div>
                <!-- auto read -->
      <div v-if="HTML">
        <mt-switch v-model="auto">自动阅读</mt-switch>
            <div v-if="auto">
              <button @click="startAuto(false)">GO</button>

              阅读速度 {{ autoSpeed }}
              <br>
              <mt-range
              v-model="autoSpeed"
              :min="10"
              :max="60"
              :step="5"
              :bar-height="5">
              </mt-range>
              <br>
            </div>
      </div>
      
      <div class="book" id="book-top">
        <div class="cover_BOOK" ref="getHtml" >

          <div v-html="HTML">
          </div>
          
          <div v-if="HTML" class="up-top" id="bottom">       
              <a href="#container" id="up-top">Up top</a>
          </div>


        </div>
      </div>
    
   <div v-if="isLoading">
      请求 
      <br>  
      {{apiSelected}}
      <br>
      {{path}}
        <mt-spinner type="triple-bounce" :size="60" color="#26a2ff">
        </mt-spinner>
    </div>

    <div v-else-if="errMessage"  class="loading" >
      {{errMessage}}
    </div>

          
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
    </div>
    
 

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import localforage from "localforage";
import debounce from "lodash.debounce";

export default {
  name: "BookIndex",
  data: function() {
    return {
      path: "",
      fontSize: null,
      auto: false,
      autoSpeed: 10    

    };
  },
  metaInfo(){
    return {
      title: this.title
    }
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
    speedMs:function(){
      return +this.autoSpeed * 1000
    }
  },
  mounted() {
    // console.log("Index mounted on");
    this.getFontSize();
    this.getAutoSpeed()    
    this.getPath();

    // console.log("Index mounted off");
  },
  created() {
    this.$store.commit("setAutoRead", false);
     // Fix once autoRead
    this.$store.commit("setHtml", ""); // Fix ole muen
    /* eslint-disable */
    this.$router.afterEach((to, from) => {
      // console.log("run router", to.path);
      this.setIndexLoading(true); // we must show the user, app running quickly
      this.setBlockLoading(false);
      // need to get time
      // console.log("Index methods getPath 2222");

      this.getPath();

      // this.path = to.path; // 给 watch 启动启动
      // console.log("run router set", this.fontSize, this.setFont);
    });
  },
  methods: {
    ...mapMutations(["setBlockLoading", "setPendingLoad", "setIndexLoading", "setTitle", "setAutoRead"]),
    ...mapActions(["showErrMessage", "getBookIndex"]),
    getPath() {
      // console.log("Index methods getPath on");
      this.path = this.$route.path;
      // console.log("Index methods getPath off");
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
                
                if(this.auto && this.autoCancel){
                  // console.log('time')
                  this.autoCancel()
                  this.startAuto()

                }else{
                  // console.log('false',this.auto,this.autoCancel)
                  
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
    async getFontSize() {
      this.fontSize =
        (await localforage.getItem("user-fontsize")) ||
        +window.getComputedStyle(document.body)["font-size"].replace("px", "");
    },
    setFont(val) {
      // console.log("setFont", val, document.querySelector("body")); // every time refs

      document.querySelector("body").style.fontSize = val + "px";
      localforage.setItem("user-fontsize", val);
      // every time refs
    },
    async getAutoSpeed() {
      this.autoSpeed = (await localforage.getItem("user-autoSpeed")) || this.autoSpeed
    },
    setAutoSpeed(val) {
      localforage.setItem("user-autoSpeed", val);
    },
    startAuto(once = true){
      // start auto read
      once && document.getElementById("up-top").click()

      const options = {
          container: 'body',
          easing: 'linear',
          offset: -60,
          cancelable: true,
          onDone: this.autoDone,
          x: false,
          y: true
      }

      this.autoCancel = this.$scrollTo("#bottom",this.speedMs,options)
    },
    autoDone(e){
      // go next page
      setTimeout(()=>{
        document.getElementById('pb_next').click()
      },this.speedMs / 7)
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
    },
    fontSize: function(n) {
      this.setFont(n);
    },  
    auto: function(n){
      this.setAutoRead(n)
    },
    autoSpeed: function(n){
      this.setAutoSpeed(n)
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
