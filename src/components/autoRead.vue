<template>
    <div>
      <div v-if="HTML">
        <mt-switch v-model="auto">自动阅读</mt-switch>
            <div v-if="auto">
              <button @click="startAuto(false)">GO</button>

              阅读速度 {{ autoSpeed }}
              <br>
              <mt-range
              v-model="autoSpeed"
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
      autoSpeed: 10
    }
  },
  mounted(){
    this.getAutoSpeed()
  },
  methods: {
    ...mapMutations(["setAutoRead","setAutoSpeeder"]),
    setAutoSpeed(val) {
      this.setAutoSpeeder(val)
      localforage.setItem("user-autoSpeed", val);
    },
    async getAutoSpeed() {
      this.autoSpeed = (await localforage.getItem("user-autoSpeed")) || this.autoSpeed
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
    autoSpeed: function(n) {
      this.setAutoSpeed(n);
    }
  }
};
</script>

<style scoped>
</style>
