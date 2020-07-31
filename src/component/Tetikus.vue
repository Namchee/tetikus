<script lang="ts">
import { defineComponent, onMounted, ref, computed, reactive, Ref, } from 'vue';

import { throttle } from './../util/throttle';

export default defineComponent({
  props: {
    showDefaultCursor: {
      type: Boolean,
      default: false,
    },

    throttleSpeed: {
      type: Number,
      default: 5,
    },

    color: {
      type: String,
      default: '#f5f5f5',
    },

    size: {
      type: Number,
      default: 36,
    },

    invertColor: {
      type: Boolean,
      default: true,
    },

    clickScale: {
      type: Number,
      default: 1,
    },
  },

  setup(props, { slots }) {
    const wrapper: Ref<HTMLElement | null> = ref(null);
    const cursor: Ref<HTMLElement | null> = ref(null);

    const mousePos = reactive({
      x: 0,
      y: 0,
    });

    const wrapperStyle = computed(() => {
      return {
        'top': `${mousePos.y}px`,
        'left': `${mousePos.x}px`,
        'mix-blend-mode': props.invertColor ? 'difference' : 'normal',
      };
    });

    const cursorStyle = computed(() => {
      return {
        'background-color': props.color,
        'width': `${props.size}px`,
        'height': `${props.size}px`,
      };
    });

    const isCustomShape = () => {
      return !!slots.default;
    }

    onMounted(() => {
      const wrapperElem = wrapper.value;
      const cursorElem = cursor.value;

      if (!wrapperElem || !cursorElem) {
        throw new Error('Failed to mount \'tetikus\'.');
      }

      // restore original cursor
      window.addEventListener('mouseout', () => {
        document.body.style.cursor = 'auto';

        wrapperElem.classList.add('tetikus--leave');
      });

      // show custom cursor
      window.addEventListener('mouseover', () => {
        if (!props.showDefaultCursor) {
          document.body.style.cursor = 'none';
        }

        wrapperElem.classList.remove('tetikus--leave');
      });

      const handleMouseMove = (event: MouseEvent) => {
        mousePos.x = event.clientX - (props.size / 2);
        mousePos.y = event.clientY - (props.size / 2);
      }

      window.addEventListener(
        'mousemove',
        throttle(handleMouseMove, props.throttleSpeed),
      );

      // add mouse click listener if click size is different
      if (props.clickScale !== 1) {
        window.addEventListener('mousedown', () => {
          cursorElem.style.transform = `scale(${props.clickScale})`;
        });

        window.addEventListener('mouseup', () => {
          cursorElem.style.transform = 'scale(1)';
        });
      }
    });

    return {
      wrapper,
      cursor,
      isCustomShape,
      wrapperStyle,
      cursorStyle,
    };
  },
});
</script>

<template>
  <div aria-hidden="true" class="tetikus" ref="wrapper" :style='wrapperStyle'>
    <div class="tetikus__cursor" ref="cursor">
      <slot v-if="isCustomShape()"></slot>

      <div
        class="tetikus__default__cursor"
        v-else
        :style="cursorStyle">
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.tetikus {
  pointer-events: none;
  position: fixed;
  z-index: 999;

  &.tetikus--leave {
    display: none;
  }

  & .tetikus__cursor {
    transition: transform 200ms ease-in-out;
    transform: scale(1);
  }

  & .tetikus__default__cursor {
    border-radius: 9999px;
  }
}
</style>
