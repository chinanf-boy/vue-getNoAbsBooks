<template>
  <div>

  </div>
</template>

<script>
  export default {
    name: "BookIndex",
    data:function(){
      return {

      }
    },
    methods:{

      getBookIndex(){
        let id = this.$route.params.id
        this.$store.dispatch('getBookIndex', id )
      }
    }
  }
</script>

<style scoped>

</style>