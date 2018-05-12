<template>
  <div class="container">
    <div v-if="HTML">
    <mt-popup
      v-model="popupVisible"
      style="background:#efbcbc;color:black;width:100%"
      position="top"
      popup-transition="popup-fade">
      {{ errMessage }}
    </mt-popup>
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
    <div class="book">
      <div  ref="getHtml" v-html="HTML"></div>
    </div>
  </div>
    <div v-if="HTML == ''"> Loading </div>
  </div>
</template>

<script>
import { mapState } from '@/store'; 

  export default {
    name: "BookIndex",
    data:function(){
      return {
        popupVisible:false,
        errMessage:"",
        HTML: ``,
        path: "",
        fontSize: null
      }
    },
    mounted(){
      this.getBookIndex()
      this.getFontSize();
    },
    created() {
      this.$router.afterEach((to, from) => {
        this.popupVisible = false
        this.path = to.path; // 给 watch 启动启动
    });
    },
    methods:{
      getBookIndex(){
        this.path = this.$route.path

        this.$store.dispatch('getBookIndex', this.$route.path ).then(res =>{

          if(res.data.status){
            let moreDetails = `${JSON.stringify(res.data)}`

            throw new Error(`资源 ERROR:${res.data.status}`)

          }else{
            this.HTML = res.data
            
          }
        }
        ).catch(err =>{
          this.errMessage = err.message
          this.popupVisible = true

        })
      },
          getFontSize() {
      this.fontSize = +window
        .getComputedStyle(document.body)
        ["font-size"].replace("px", "");
    },
        setFont(val) {
      this.$refs.getHtml.style.fontSize = val + "px";
    }
    },
    watch:{
      'popupVisible':function(n){
        setTimeout(() => {
          this.popupVisible = false
        }, 5000);
      },
      path:function(){
        this.HTML = ``
        this.getBookIndex()
      },
    fontSize: function(n){
      this.setFont(n)
    }
    }
  }
</script>

<style scoped>

</style>