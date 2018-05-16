<template>
  <div class="container">
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

      <div class="book">
        <div class="cover_BOOK" ref="getHtml" >

          <div v-html="HTML">

          </div>
        </div>
      </div>

    <div v-if="errMessage && !isLoading"  class="loading" >
      {{errMessage}}
    </div>
    
   <div v-else-if="isLoading">
      请求 
      <br>  
      {{apiSelected}}
      <br>
      {{path}}
        <mt-spinner type="triple-bounce" :size="60" color="#26a2ff">
        </mt-spinner>
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
import {mapState, mapActions, mapMutations} from "vuex";
import localforage from "localforage";

export default {
  name: "BookIndex",
  data: function() {
    return {
      path: "",
      fontSize: null
    };
  },
  computed: {
    ...mapState({
      errMessage: state => state.errMessage,
      fullurl: state => state.fullURL,
      apiSelected: state => state.apiSelected,
      HTML: state => state.HTML,
      isLoading: state => state.isIndexLoading,
      messageForUser: state => state.messageForUser
      
    })
  },
  mounted() {
    console.log("Index mounted on");
    this.getFontSize();
    this.getPath();
    console.log("Index mounted off");
  },
  created() {
    this.$router.afterEach((to, from) => {
      console.log("run router", to.path);
      this.setBlockLoading(false);
      this.path = to.path; // 给 watch 启动启动
      console.log("run router set", this.fontSize, this.setFont);
    });
  },
  methods: {
    ...mapMutations(["setBlockLoading"]),
    ...mapActions(["showErrMessage"]),
    getPath() {
      console.log("Index methods getPath on");
      this.path = this.$route.path;
      console.log("Index methods getPath off");
    },
    getBookIndex() {
      console.log("Index methods getBookIndex on", this.apiSelected, this.path);

      this.$store
        .dispatch("getBookIndex", this.path)
        .then(res => {
          
          let T = 0
          let Wait;
          waitChapter()
          function waitChapter(){

            if(document.getElementsByClassName("chapter").length > 0){
            // in phone HTML != document is no sync， there have time less
                  Wait = null

                  let ul1 = document.getElementsByClassName("chapter") 
  
                  
                  let ul = Array.from(ul1)
                
                  ul.forEach(x =>{
                    x.style.display = ''
                  })
                  console.log("getBookIndex HTML ✅",ul1);
            }else{

              console.log(`getBookIndex HTML put the document
              is no sync,there have time less
              in phone `+T)

              if(T<3){
                T ++      
                Wait = setTimeout(waitChapter,1)
              }else{
                throw new Error("o see like error HTML")
              }
            }
        }
        })
        .catch(err => {
          console.log("getBookIndex ❌",err);
        });
      console.log(
        "Index methods getBookIndex off",
        this.apiSelected,
        this.path
      );
    },
    async getFontSize() {
      this.fontSize =
        (await localforage.getItem("user-fontsize")) ||
        +window.getComputedStyle(document.body)["font-size"].replace("px", "");
    },
    async setFont(val) {
      console.log("setFont", val, document.querySelector("body")); // every time refs
      // if(this.$refs.getHtml){

      //   this.$refs.getHtml.style.fontSize = val + "px";

      // }else{
      document.querySelector("body").style.fontSize = val + "px";
      await localforage.setItem("user-fontsize", val);
      console.log(
        "setFont localforage",
        await localforage.getItem("user-fontsize")
      ); // every time refs

      // }
      // console.log('setFont', val, this.$refs.getHtml)
    }
  },
  watch: {
    path: function() {
      console.log("Index watch path on");
      this.getBookIndex();
      console.log("Index watch path off");
    },
    fontSize: function(n) {
      this.setFont(n);
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
</style>