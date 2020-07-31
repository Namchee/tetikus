<script>
import Tetikus from './component/Tetikus';

export default {
  components: {
    Tetikus,
  }
}
</script>

<template>
  <main class="main">
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
}

.test-content {
  background: yellow;
  padding: 1rem;
}
</style>