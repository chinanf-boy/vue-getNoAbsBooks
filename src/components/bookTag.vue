<template>
    <div>
        <button type="submit" @click="addBookTag(fullURL)">添加书签</button>
    </div>
</template>

<script>
import { mapActions,mapState } from "vuex";


export default {
  name: "IndexBookTag",
  computed:{
    ...mapState(["fullURL"])
  },
  methods:{
    ...mapActions(["addBookTag"])
  }
};
</script>

<style scoped>
</style>