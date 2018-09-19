<template>
    <div>
        <button type="submit" @click="addActBookTags({url:fullURL,title})">添加书签</button>
    </div>
</template>

<script>
import { mapActions,mapState } from "vuex";


export default {
  name: "IndexBookTag",
  computed:{
    ...mapState(["fullURL", "title"])
  },
  methods:{
    ...mapActions(["addActBookTags"])
  }
};
</script>

<style scoped>
</style>