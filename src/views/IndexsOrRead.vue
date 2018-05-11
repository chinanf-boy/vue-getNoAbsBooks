<template>
  <div>
    <div class="book">
      <div v-if="fontSize">
        字体大小 {{ fontSize }}
        <br>
        <mt-range
          v-model="fontSize"
          :min="13"
          :max="25"
          :step="1"
          :bar-height="2">
        </mt-range>
      </div>
      <div ref="getHtml" v-html="HTML"></div>
    </div>
  <div v-if="!HTML"> Loading </div>
  </div>
</template>

<script>
import {mapState} from "@/store";

export default {
  name: "BookIndexOrRead",
  data: function() {
    return {
      HTML: ``,
      fullPath: "",
      id: "",
      fontSize: 0
    };
  },
  mounted() {
    this.getBookIndex();
    this.getFontSize();
  },
  created() {
    this.$router.afterEach((to, from) => {
      this.fullPath = to.path; // 给 watch 启动启动
    });
  },
  methods: {
    getBookIndex() {
      this.id = this.$route.params.id;
      let pages = this.$route.params.pages;
      let {id} = this;
      this.$store
        .dispatch("getBookIndex", {id, pages})
        .then(res => {
          console.log(res)
          if (res) {
            this.HTML = res.data;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getFontSize() {
      this.fontSize = +window
        .getComputedStyle(document.body)
        ["font-size"].replace("px", "");
    },
    setFont(val) {
      this.$refs.getHtml.style.fontSize = event + "px";
    }
  },
  watch: {
    fullPath: function(n) {
      this.HTML = ``
      this.getBookIndex();
    },
    fontSize: function(n){
      this.setFont(n)
    }
  }
};
</script>

<style scoped>

</style>