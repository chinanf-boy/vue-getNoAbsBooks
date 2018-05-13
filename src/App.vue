<template>
  <div>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
  <footer>
  </footer>
  </div>
</template>

<style>
.nr_title {
  font-size: 1.3em;
}

li {
  list-style: none !important;
}

a {
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
}

body {
  text-align: left;
  width: 100%;
  margin: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, .05);
  -webkit-touch-callout: none;

  -webkit-user-select: none;
  /*background: #e9dfc7;*/
  overflow: hidden;
  /*position: fixed;*/
}

ul {
  padding-left: 0;
}

li {
  list-style: none;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #fbf6ec;
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

button {
color: #666;
background-color: #eee;
border-color: #eee;
font-weight: 300;
font-size: 16px;
background-color: #7B72E9;
border-color: #7B72E9;
color: #FFF;
font-family: "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial,
"Lucida Grande", sans-serif;
text-decoration: none;
text-align: center;
line-height: 40px;
height: 40px;
padding: 0 40px;
margin: 0;
display: inline-block;
appearance: none;
cursor: pointer;
border: none;
border-top-color: currentcolor;border-right-color: currentcolor;border-bottom-color: currentcolor;border-left-color: currentcolor;
-webkit-box-sizing: border-box;
-moz-box-sizing: border-box;
box-sizing: border-box;
-webkit-transition-property: all;
transition-property: all;
-webkit-transition-duration: 0.3s;
transition-duration: 0.3s;
margin: 1em;
}
footer {
  position: absolute;
  height: 30%;
  width: 100%;
}
</style>
