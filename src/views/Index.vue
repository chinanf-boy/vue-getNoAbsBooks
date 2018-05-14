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
      <div class="cover_BOOK" ref="getHtml" >

        <div v-html="HTML">

        </div>
      </div>
    </div>
    <div v-if="HTML==''"  class="loading" >
      <mt-spinner type="triple-bounce" :size="60" color="#26a2ff">
        </mt-spinner>
      </div>
  </div>
</template>

<script>
import { mapState } from '@/store'; 
import localforage from 'localforage'

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
      console.log('mounted again')

    },
    created() {
      console.log('path ==>>> to.path')
      
      this.path = this.$route.path
      this.$router.afterEach((to, from) => {
        console.log('run router',to.path)
        this.popupVisible = false
        this.path = to.path; // 给 watch 启动启动
        console.log('run router set',this.fontSize, this.setFont)
        
        this.setFont(this.fontSize)
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
      async getFontSize() {
      this.fontSize = await localforage.getItem('user-fontsize')
      || +window
        .getComputedStyle(document.body)
        ["font-size"].replace("px", "");
      },
      async setFont(val) {
        console.log('setFont', val, document.querySelector('body')) // every time refs
        // if(this.$refs.getHtml){

        //   this.$refs.getHtml.style.fontSize = val + "px";

        // }else{
          document.querySelector('body').style.fontSize =  val + "px"
          await localforage.setItem('user-fontsize',val)
          console.log('setFont localforage', await localforage.getItem('user-fontsize')) // every time refs
          
        // }
        // console.log('setFont', val, this.$refs.getHtml)
        
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
      },
      fontSize: function(n){
        this.setFont(n)
    }
    }
  }
</script>

<style scoped>
.cover_BOOK{
  margin: auto 1rem auto 1rem;
}

</style>