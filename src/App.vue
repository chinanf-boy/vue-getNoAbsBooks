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

.nr_title{
  font-size: 1.3em
}

li {
  list-style: none !important;
}

a {
  text-decoration: none !important;
}

table{
  width: 100% !important;
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

footer {
  position: absolute;
  height: 30%;
  width: 100%;
}
</style>
