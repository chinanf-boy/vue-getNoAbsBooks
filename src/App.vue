<template>
  <div >
  <div id="app">
    <mt-popup
      v-model="popupVisible"
      style="background:#efbcbc;color:black;width:100%"
      position="top"
      popup-transition="popup-fade">
      {{ errMessage }}
    </mt-popup>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About me</router-link>
    </div>
    <router-view/>
  </div>
  <footer>
<a href="https://github.com/chinanf-boy">
    <p  class="bottom" >
      <span style="color:orange;">  @chinanf-boy </span>  2018.10.15
    </p>

    </a> 
  </footer>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "App",
  data: function() {
    return {
      popupVisible: false
    };
  },
  created: function() {
    // console.log("app created on");
    // this.Init()
    // console.log("app created off");
  },
  mounted: function() {
    // console.log("app mounted on");
    // console.log("app mounted off");
  },
  methods: {
    Init() {
      // console.log("app method Init on");
      // console.log("app method Init off");
    }
  },
  computed: {
    ...mapState({
      isBlockLoading: state => state.isBlockLoading,
      errMessage: state => state.errMessage
    })
  },
  watch: {
    isBlockLoading: function(N) {
      this.popupVisible = N;
    }
  }
};
</script>
<style>
.back_r {
  padding: 0 1rem;
  height: 2rem;
  margin: 1rem 30%;
  line-height: 2rem;
  font-size: 1rem;
  background-color: #65bbec;
  border-radius: rem;
  width: auto;
}
.back_r a {
  color: #fff;
}
.block {
  color: #666;
}
.intro_info {
  color: #666;
}
.ablum_read span {
  background: #65bbec;
  border-radius: 3px;
  height: auto;
  line-height: 40px;
  text-align: center;
  width: 51%;
  float: left;
  margin: auto auto;
}
.ablum_read span a {
  color: #fff;
}

.intro {
  border-bottom: 1px solid #65bbec;
  background: #ecf0f0;
  height: 35px;
  line-height: 38px;
  padding-left: 8px;
  font-weight: 700;
  font-size: 15px;
  color: #000;
  margin: 1rem;
}

.chapter {
  text-align: left;
}

.chapter li {
  border-bottom: 1px solid #efefef;
  text-indent: 10px;
  height: 40px;
  line-height: 40px;
  color: #999;
  overflow: hidden;
}

.nr_title {
  font-size: 1.3em;
}

.middle {
  width: 50%;
  margin: 1rem;
  border: 1px solid #dfdfdf;
}

li {
  list-style: none !important;
}

a {
  color: #000;
  font-weight: 400;
  text-decoration: none !important;
}

table {
  width: 100% !important;
}

*:focus {
  outline: none;
}

html {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  font: 16px/1.5 "microsoft yahei";
}

body {
  text-align: left;
  width: 100%;
  margin: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
  -webkit-touch-callout: initial;
  -webkit-user-select: none;
  background-color: #fbf6ec;
  overflow: hidden;
  /*position: fixed;*/
}

ul {
  padding-left: 0;
  margin-bottom: 0;
}

li {
  list-style: none;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
  background-color: #fbf6ec;
}
.loading {
  width: 100%;
  position: absolute;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.nr_page a {
  border-radius: 0.533333vw;
  background-color: #56d176;
  color: #fff;
  padding: 0 2.666667vw 0 2.666667vw;
  min-width: 32vw;
  text-align: center;
  font-size: 1.5rem;
  font-family: inherit;
}
button {
  font-size: 1rem;
  background-color: #7b72e9;
  border-color: #7b72e9;
  color: #fff;
  font-family: "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial,
    "Lucida Grande", sans-serif;
  text-decoration: none;
  text-align: center;
  line-height: 3rem;
  height: 3rem;
  padding: 0 1.8rem;
  display: inline-block;
  appearance: none;
  cursor: pointer;
  border: none;
  border-top-color: currentcolor;
  box-sizing: border-box;
  transition-property: all;
  transition-duration: 0.3s;
  margin: 1em;
  font-weight: normal;
}
footer {
  position: absolute;
  height: 30%;
  width: 100%;
}
.bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
}
</style>
