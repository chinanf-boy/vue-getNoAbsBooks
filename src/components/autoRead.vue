<template>
    <div>
      <div v-if="HTML">
        <mt-switch v-model="auto">自动阅读</mt-switch>
            <div v-if="auto">
              <button class="read_go"  @click="startAuto(false)">GO</button>

              阅读时间 {{ time }}
              <br>
                <mt-range
                v-model="time"
                :min="10"
                :max="60"
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

export default {
  name: "IndexAutoRead",
  data: function() {
    return {
      auto: false,
      time: 10
    }
  },
  mounted(){
    this.getAutoTime()
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
    startAuto(once = true){
      // start auto read
      once && document.getElementById("up-top").click()

      const options = {
          container: 'body',
          easing: 'linear',
          offset: -60,
          cancelable: true,
          onDone: this.autoDone,
          x: false,
          y: true
      }

      this.autoCancel = this.$scrollTo("#bottom",this.speedMs,options)
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
      autoTime: state => state.autoTime
    }),
      speedMs: function() {
      return +this.autoTime * 1000;
    },
  },
  watch: {
    auto: function(n) {
      this.setAutoRead(n);
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
