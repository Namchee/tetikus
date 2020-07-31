<script lang="ts">
import Tetikus from './component/Tetikus.vue';

export default {
  components: {
    Tetikus,
  }
}
</script>

<template>
  <main class="main">
    <h1 class="title">
      Tetikus Playground
    </h1>
    <section class="test-content">
      test 1 2 3
    </section>
    <tetikus :clickScale=".8">

    </tetikus>
  </main>
</template>

<style lang="postcss" scoped>
.main {
  width: 100vw;
  height: 100vh;
  background-color: #121212;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.title {
  font-size: 5rem;
  text-align: center;
  padding: 2rem;
  margin: 0;
}

.test-content {
  background: yellow;
  color: #121212;
  padding: 1rem;
}
</style>