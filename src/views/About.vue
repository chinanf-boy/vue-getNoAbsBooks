<template>
    <div class="about">
        <a href="https://github.com/chinanf-boy"> {{go}} Follow me 😊 <br> {{go}} Star project ❤️  </a>
        <div>
             yobrave 2018 5.13
            </div>
    </div>
</template>

<script>
export default {
  name: "About",
  data() {
    return {
      go: ">>"
    };
  }
};
</script>

<style scoped>
.about {
  margin: 3rem;
}
.about a {
  display: block;
  margin: 10%;
  padding: 1rem;
  color: rgba(125, 80, 231, 0.788);
  border: 1px solid grey;
}
</style>
