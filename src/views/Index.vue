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
  </div>
    <div class="book">
      <div class="cover" ref="getHtml" v-html="HTML"></div>
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
      this.getFontSize();
    },
    created() {
      console.log('path ==>>> to.path')
      
      this.path = this.$route.path
      this.$router.afterEach((to, from) => {
        console.log('run router',to.path)
        this.popupVisible = false
        this.path = to.path; // 给 watch 启动启动
    })
    },
    methods:{
      getBookIndex(){
        console.log('run getBookIndex',this.path,this.$route.params)
        if(this.$route.params.api){

          this.$store.commit("setApiSelected",this.$route.params.api)
        }
        this.$store.dispatch('getBookIndex', this.path ).then(res =>{
          console.log('get Book html', res)
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
        console.log('path change')
        this.HTML = ``
        this.getBookIndex()
        this.setFont(this.fontSize);
        
      },
      fontSize: function(n){
        this.setFont(n)
    }
    }
  }
</script>

<style scoped>
.cover{
  margin: auto 1rem auto 1rem;
}

</style>