<template>
    <div>
      <div v-if="HTML">
        <mt-switch v-model="setting">设置</mt-switch>
        <div v-if="setting">

        <font-size></font-size>
        <book-tag></book-tag>

        
              <button class="read_go" style="padding:0.1rem;border-radius: 20%;"><mt-switch v-model="auto">自动阅读</mt-switch></button>

              阅读时间 {{ time }}
              <br>
                <mt-range
                v-model="time"
                :min="10"
                :max="100"
                :step="5"
                :bar-height="5">
                <div slot="start">最快 </div>
                <div slot="end"> 最慢</div>
                </mt-range>
              <br>
            </div>
      </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import localforage from "localforage";
import fontSize from "@/components/fontSize.vue";
import bookTag from "@/components/bookTag.vue";


export default {
  name: "IndexAutoRead",
  components: {
    fontSize,
    bookTag
  },
  data: function() {
    return {
      auto: false,
      time: 10,
      setting: false
    }
  },
  mounted(){
    this.getAutoTime()
  },
  created() {
  /* eslint-disable */
    this.$router.afterEach((to, from) => {
      this.setting = false
      if(to.path.includes('http')){
        if(this.autoRead){
          window._startAutoRead = this.startAuto.bind(this);
        }else{
          delete window._startAutoRead
        }
      }
    });
  },
  methods: {
    ...mapMutations(["setAutoRead","setAutoTimer"]),
    setAutoTime(val) {
      this.setAutoTimer(val)
      localforage.setItem("user-autoTime", val);
    },
    async getAutoTime() {
      this.time = (await localforage.getItem("user-autoTime")) || this.time
    },
    startAuto(auto){
      // start auto read


      const options = {
          container: 'body',
          easing: 'linear',
          offset: -60,
          cancelable: true,
          onDone: this.autoDone,
          x: false,
          y: true
      }
      this.autoCancel = auto ? this.$scrollTo("#bottom",this.speedMs,options) : this.autoCancel()
    },
    autoDone(e){
      // go next page
      setTimeout(()=>{
         document.getElementById('pb_next') && document.getElementById('pb_next').click()
      },2000)
    },
  },
  computed: {
    ...mapState({
      HTML: state => state.HTML,
      autoTime: state => state.autoTime,
      autoRead: state => state.autoRead
    }),
      speedMs: function() {
      return +this.autoTime * 1000;
    },
  },
  watch: {
    auto: function(n) {
      this.setAutoRead(n);
      this.startAuto(n)
    },
    time: function(n) {
      this.setAutoTime(n);
    }
  }
};
</script>

<style scoped>
.center{

}
</style>
