<template>
  <div>
    <div class="book">
      <div v-html="HTML"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from '@/store'; 

  export default {
    name: "BookIndex",
    data:function(){
      return {
        HTML: ``,
        pages: "",
        id: ""
      }
    },
    mounted(){
      this.getBookIndex()
    },
    methods:{
      getBookIndex(){
        this.id = this.$route.params.id
        let { id } = this
        this.$store.dispatch('getBookIndex', { id } ).then(res =>{

          if(res.data.status){
            let moreDetails = `${JSON.stringify(res.data)}`

            this.HTML = `资源 ERROR:${res.data.status}`

          }else{
            this.HTML = res.data
            
          }
        }
        )
      }
    },
    watch:{
      // 'pages':function(n){
      //   this.getBookIndex()
      // }
    }
  }
</script>

<style scoped>

</style>