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
  <div v-if="isLoading"  class="loading" >
    <span> 请求 {{fullurl}}  </span>
        <mt-spinner type="triple-bounce" :size="60" color="#26a2ff">
        </mt-spinner>
  </div>
  <div v-else-if="errMessage">{{errMessage}}</div>
  <div v-else-if="HTML==''"> 如果你认为这个错误是个bug <br> <a style="color:red;" href="http://github.com/chinanf-boy/vue-getNoAbsBooks">👉 提交bug</a> </div>
  

  </div>
</template>

<script>
import { mapState,mapActions,mapMutations } from 'vuex'; 
import localforage from 'localforage'

  export default {
    name: "BookIndex",
    data:function(){
      return {
        HTML: ``,
        path: "",
        fontSize: null,
      }
    },
    computed:{
      ...mapState({
        errMessage:(state) => state.errMessage,
        fullurl:(state) => state.fullURL,
        isLoading:state => state.isIndexLoading,
      })
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
        this.setBlockLoading(false)
        this.path = to.path; // 给 watch 启动启动
        console.log('run router set',this.fontSize, this.setFont)
        
        this.setFont(this.fontSize)
    })
    },
    methods:{
      ...mapMutations(['setBlockLoading']),
      ...mapActions(['showErrMessage']),
      getBookIndex(){
        console.log('run getBookIndex',this.path,this.$route.params)

        this.$store.dispatch('getBookIndex', this.path ).then(res =>{
          console.log('getBookIndex ✅', res)

          if(res.data.status > 300){
            let moreDetails = `${JSON.stringify(res.data)}`

            throw new Error(`资源 ERROR:${res.data.status}`)

          }else{
            this.HTML = res.data
          }
          
        }).catch(err =>{
          console.log('getBookIndex ❌',err.message)
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
      path:function(){
        console.log('path change')
        this.getBookIndex()
        this.HTML = ``
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