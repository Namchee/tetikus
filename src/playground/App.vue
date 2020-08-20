<script lang="ts">
import Tetikus from '@/components/Tetikus';
import { TetikusHover } from '@/directives/hover';

export default {
  components: {
    Tetikus,
  },

  directives: {
    thover: TetikusHover,
  },
}
</script>

<template>
  <main class="w-screen h-screen bg-gray-100">
    <h1 class="text-4xl font-medium p-8">
      Tetikus Playground
    </h1>
    <section class="px-8">
      <h2 class="text-2xl mb-4" v-thover="{ color: 'red' }">
        Colored Background Test
      </h2>
      <div class="bg-yellow-400 inline-block p-8 rounded mr-4">
        Yellow
      </div>
      <div class="bg-red-400 inline-block p-8 rounded mx-4">
        Red
      </div>
      <div class="bg-blue-400 inline-block p-8 rounded mx-4">
        Blue
      </div>
      <div class="bg-indigo-400 inline-block p-8 rounded mx-4">
        Indigo
      </div>
      <div class="bg-gray-800 text-white inline-block p-8 rounded ml-4">
        Dark Gray
      </div>
    </section>

    <tetikus
      :color="'transparent'"
      :strokeWidth="1.25"
      :strokeColor="'#121212'"
      :size="16"
      :contentPosition="'right'"
      :hideOnOut="false"
      @tetikus-element-hover='hoverElem'
    >
      <template v-slot:contents>
        <div class="text-xs uppercase font-semibold tracking-wide">
          View
        </div>
      </template>
    </tetikus>
  </main>
</template>

<style lang="postcss" scoped>
.main {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>