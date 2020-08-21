<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  reactive,
  Ref,
  onBeforeUnmount,
  watch,
} from 'vue';

import { throttle } from '@/util/throttle';
import { lerp } from '@/util/math';
import { hoverState } from '@/directives/hover';

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
      default: 1,
    },

    // determine stroke width for default cursor shape
    strokeWidth: {
      type: Number,
      default: 0,
    },

    // background color for default pointer
    color: {
      type: String,
      default: '#f5f5f5',
    },

    // determine stroke color for default cursor shape
    // won't have any effect if stroke width is 0
    strokeColor: {
      type: String,
      default: '#121212',
    },

    // base size for default pointer
    size: {
      type: Number,
      default: 36,
    },

    // determines mix blend mode value on custom cursor
    invertColor: {
      type: Boolean,
      default: false,
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

    // cursor opacity
    opacity: {
      type: Number,
      default: 1,
      validator: (value: number) => {
        return value >= 0 && value <= 1;
      }
    },

    // determines if the cursor should be hidden when the cursor position is outside the window
    hideOnOut: {
      type: Boolean,
      default: false,
    },

    // determines content position
    contentPosition: {
      type: String,
      validator: (val: string) => ['center', 'bottom', 'right'].includes(val),
      default: 'center',
    },

    // determines linear interpolation value (a.k.a movement animation)
    lerp: {
      type: Number,
      default: 1,
    },
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
      const baseStyles: Record<string, unknown> = {
        'opacity': props.opacity,
        'mix-blend-mode': props.invertColor ? 'difference' : 'normal',
        'flex-direction': props.contentPosition === 'bottom' ?
          'column' : 'row',
        'justify-content': props.contentPosition !== 'right' ?
          'center' : 'justify-evenly',
        'align-items': props.contentPosition !== 'bottom' ?
          'center' : 'justify-evenly',
      };

      if (props.lerp === 1) {
        baseStyles['top'] = `${mousePos.y}px`;
        baseStyles['left'] = `${mousePos.x}px`;
      }

      return baseStyles;
    });

    const cursorStyle = computed(() => {
      return {
        'background-color': props.color,
        'border-width': `${props.strokeWidth}px`,
        'border-style': 'solid',
        'border-color': props.strokeColor,
        'width': `${props.size}px`,
        'height': `${props.size}px`,
      };
    });

    const contentStyle = computed(() => {
      return {
        'position': props.contentPosition === 'center' ?
          'absolute' : 'center',
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

      if (props.hideOnOut) {
        wrapperElem.classList.add('tetikus--leave');
      }

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

    // handle linear interpolation if option is enabled
    const handleLerp = () => {
      const cursorEl = wrapper.value as HTMLElement;

      const x = lerp(cursorEl.style.left, mousePos.x, props.lerp);
      const y = lerp(cursorEl.style.top, mousePos.y, props.lerp);

      cursorEl.style.left = `${x}px`;
      cursorEl.style.top = `${y}px`;

      requestAnimationFrame(handleLerp);
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

        if (props.lerp !== 1) {
          // linear interpolator
          requestAnimationFrame(handleLerp);
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

    // watch any hover state changes and emit event
    watch(hoverState, (state) => {
      if (state) {
        emit('tetikus-element-hover', state);
      } else {
        emit('tetikus-element-out');
      }
    });

    return {
      wrapper,
      cursor,
      isCustomShape,
      showPointer,
      wrapperStyle,
      cursorStyle,
      contentStyle,
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
    <!-- start: cursor shape part -->
    <div class="tetikus__cursor" ref="cursor">
      <slot v-if="isCustomShape()">
      </slot>

      <div
        class="tetikus__default__cursor"
        v-else
        :style="cursorStyle">
      </div>
    </div>
    <!-- end: cursor shape part -->

    <!-- start: cursor contents -->
    <div
      class="tetikus__contents"
      :style="contentStyle"
    >
      <slot name="contents"></slot>
    </div>
    <!-- end: cursor contents -->

  </div>
</template>

<style lang="postcss" scoped>
.tetikus {
  pointer-events: none;
  position: fixed;
  z-index: 999;
  display: flex;

  &.tetikus--leave {
    display: none;
  }

  & .tetikus__cursor {
    box-sizing: border-box;
    transition: transform 150ms ease-in-out;
    transform: scale(1);
  }

  & .tetikus__default__cursor {
    border-radius: 9999px;
  }
}
</style>
