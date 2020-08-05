<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  reactive,
  Ref,
  onBeforeUnmount,
} from 'vue';

import { throttle } from './../util/throttle';

export default defineComponent({
  props: {
    // determine if the default browser-controlled pointer should still be shown
    showDefaultCursor: {
      type: Boolean,
      default: false,
    },

    // determine throttle speed, a.k.a number of events that should be fired
    // Per 1000 milliseconds, mouse events will be fired (1000 / throttleSpeed) time(s)
    throttleSpeed: {
      type: Number,
      default: 5,
    },

    // background color for default pointer
    color: {
      type: String,
      default: '#f5f5f5',
    },

    // base size for default pointer
    size: {
      type: Number,
      default: 36,
    },

    // determines
    invertColor: {
      type: Boolean,
      default: true,
    },

    // control pointer size on mouse up-down events
    clickScale: {
      type: Number,
      default: 1,
    },

    // determines if the custom cursor should show on touch devices
    showOnTouch: {
      type: Boolean,
      default: false,
    },

    opacity: {
      type: Number,
      default: 1,
      validator: (value: number) => {
        return value >= 0 && value <= 1;
      }
    }
  },

  setup(props, { slots, emit }) {
    // wrapper element ref
    const wrapper: Ref<HTMLElement | null> = ref(null);
    // cursor element ref
    const cursor: Ref<HTMLElement | null> = ref(null);

    // mouse position state
    const mousePos = reactive({
      x: 0,
      y: 0,
    });

    const wrapperStyle = computed(() => {
      return {
        'top': `${mousePos.y}px`,
        'left': `${mousePos.x}px`,
        'opacity': props.opacity,
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

    // determine if the component should render on touch-based devices
    const showPointer = () => {
      const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

      return !isTouchDevice() || (isTouchDevice() && props.showOnTouch);
    }

    // detect if custom shape is preferred instead
    const isCustomShape = () => {
      return !!slots.default;
    }

    /**
     * Begin event listeners part
     * These functions should only be called on mounted-related hooks
     */

    // restore default cursor on mouse out
    const handleMouseOut = () => {
      const wrapperElem = wrapper.value as HTMLElement;
      document.body.style.cursor = 'auto';

      wrapperElem.classList.add('tetikus--leave');

      emit('tetikus-window-leave');
    }

    // hide normal cursor on demand
    const handleMouseOver = () => {
      if (!props.showDefaultCursor) {
        document.body.style.cursor = 'none';
      }

      const wrapperElem = wrapper.value as HTMLElement;

      wrapperElem.classList.remove('tetikus--leave');

      emit('tetikus-window-enter');
    };

    // change mouse position on mouse movements
    const handleMouseMove = throttle((event: MouseEvent) => {
      mousePos.x = event.clientX - (props.size / 2);
      mousePos.y = event.clientY - (props.size / 2);

      emit('tetikus-mouse-move', event);
    }, props.throttleSpeed);

    // scale pointer size on mouse down
    const handleMouseDown = (event: MouseEvent) => {
      const cursorElem = cursor.value as HTMLElement;

      cursorElem.style.transform = `scale(${props.clickScale})`;

      emit('tetikus-mouse-down', event);
    }

    // restore original pointer size on mouse up
    const handleMouseUp = (event: MouseEvent) => {
      const cursorElem = cursor.value as HTMLElement;

      cursorElem.style.transform = `scale(1)`;

      emit('tetikus-mouse-up', event);
    }

    // attach event listeners
    onMounted(() => {
      if (showPointer()) {
        window.addEventListener('mouseout', handleMouseOut);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousemove', handleMouseMove);

        // add mouse click listener if click size is different
        if (props.clickScale !== 1) {
          window.addEventListener('mousedown', handleMouseDown);
          window.addEventListener('mouseup', handleMouseUp);
        }
      }
    });

    // clean the attached event listeners
    onBeforeUnmount(() => {
      if (showPointer()) {
        window.removeEventListener('mouseout', handleMouseOut);
        window.removeEventListener('mouseover', handleMouseOver);
        window.removeEventListener('mousemove', handleMouseMove);

        // remove mouse click listener if click size is different
        if (props.clickScale !== 1) {
          window.removeEventListener('mousedown', handleMouseDown);
          window.removeEventListener('mouseup', handleMouseUp);
        }
      }
    });

    return {
      wrapper,
      cursor,
      isCustomShape,
      showPointer,
      wrapperStyle,
      cursorStyle,
    };
  },
});
</script>

<template>
  <div
    aria-hidden="true"
    class="tetikus"
    ref="wrapper"
    :style='wrapperStyle'
    v-if="showPointer()"
  >
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
    transition: transform 150ms ease-in-out;
    transform: scale(1);
  }

  & .tetikus__default__cursor {
    border-radius: 9999px;
  }
}
</style>
