<template>
    <div>
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
      <div slot="start">最小</div>
  <div slot="end">最大</div>
      </mt-range>
      </div>
      </div>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import localforage from 'localforage';

export default {
  name: 'IndexFontSize',
  data: function() {
    return {
      fontSize: null
    };
  },
  mounted() {
    this.getFontSize();
  },
  computed: {
    ...mapState({
      HTML: state => state.HTML
    })
  },
  methods: {
    setFont(val) {
      // console.log("setFont", val, document.querySelector("body")); // every time refs
      document.querySelector('body').style.fontSize = val + 'px';
      localforage.setItem('user-fontsize', val);
      // every time refs
    },
    
    async getFontSize() {
      this.fontSize =
        (await localforage.getItem('user-fontsize')) ||
        +window.getComputedStyle(document.body)['font-size'].replace('px', '');
    }
  },
  watch: {
    fontSize: function(n) {
      this.setFont(n);
    }
  }
};
</script>

<style scoped>
</style>