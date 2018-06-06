<template>
    <div>
      <div v-if="HTML">
        <mt-switch v-model="auto">自动阅读</mt-switch>
            <div v-if="auto">
              <button @click="startAuto(false)">GO</button>

              阅读时间 {{ autoTime }}
              <br>
              <mt-range
              v-model="autoTime"
              :min="10"
              :max="60"
              :step="5"
              :bar-height="5">
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
  props: {
    startAuto: Function
  },
  data: function() {
    return {
      auto: false,
      autoTime: 10
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
      this.autoTime = (await localforage.getItem("user-autoTime")) || this.autoTime
    },
  },
  computed: {
    ...mapState({
      HTML: state => state.HTML
    })
  },
  watch: {
    auto: function(n) {
      this.setAutoRead(n);
    },
    autoTime: function(n) {
      this.setAutoTime(n);
    }
  }
};
</script>

<style scoped>
</style>
