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

import { throttle } from './../../util/throttle';
import { lerp } from './../../util/math';
import { generateCSSTransform } from './../../util/dom';
import { hoverState } from './../../directives/hover';
import {
  TransformProps,
  HoverBehavior,
  TetikusProps,
} from './../../common/types';
import {
  defaultTransitionSpeed,
  defaultEasingFunction,
  defaultDelay,
} from './options';

// button mapping utility
const buttonMap: Map<number, string> = new Map([
  [0, 'left'],
  [1, 'middle'],
  [2, 'right'],
]);

export default defineComponent({
  props: {
    // determine if the default browser-controlled pointer should still be shown
    showDefaultCursor: {
      type: Boolean,
      default: false,
    },

    // determine throttle speed, a.k.a number of events that should be fired
    // Per 1000 milliseconds, mouse events will be fired
    // (1000 / throttleSpeed) time(s)
    throttleSpeed: {
      type: Number,
      default: 1,
    },

    // determine stroke width for default cursor shape
    borderWidth: {
      type: Number,
      default: 2,
    },

    // background color for default pointer
    color: {
      type: String,
      default: 'transparent',
    },

    // determine stroke color for default cursor shape
    // won't have any effect if stroke width is 0
    borderColor: {
      type: String,
      default: '#121212',
    },

    // base size for default pointer
    size: {
      type: Number,
      default: 48,
    },

    // determines mix blend mode value on custom cursor
    invertColor: {
      type: Boolean,
      default: false,
    },

    // determines which mouse button press will trigger mousedown events
    buttonMap: {
      type: Array,
      default: () => ['left'],
      validator: (values: string[]) => {
        return values.every(
          (value: string) => ['left', 'middle', 'right'].includes(value),
        );
      },
    },

    // control pointer size on mouse up-down events
    clickBehavior: {
      type: Object as () => TransformProps,
      default: {},
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
      },
    },

    // determines if the cursor should be hidden when the cursor position
    // is outside the window
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

    // determines linear interpolation value (a.k.a slo-mo movement animation)
    lerp: {
      type: Number,
      default: 1,
    },

    // determine default transition speed when property is not supplied
    // on behavior
    defaultTransitionSpeed: {
      type: Number,
      default: defaultTransitionSpeed.value,
    },

    // determine default easing function when property is not supplied
    // on behavior. Must be CSS-compatible easing function
    defaultEasing: {
      type: String,
      default: defaultEasingFunction.value,
    },

    // determine default delay duration when property is not supplied
    // on behavior
    defaultDelay: {
      type: Number,
      default: defaultDelay.value,
    },

    // Unified tetikus props
    // Useful to avoid apropcalypse
    options: {
      type: Object as () => TetikusProps,
      default: {},
    },
  },

  setup(properties, { slots, emit }) {
    // construct new props unified object from options
    // any undefined values will fallback normally.
    const props = { ...properties, ...properties.options };

    // wrapper element ref
    const wrapper: Ref<HTMLElement | null> = ref(null);
    // cursor element ref
    const cursor: Ref<HTMLElement | null> = ref(null);

    // mouse position state
    const mousePos = reactive({
      x: 0,
      y: 0,
    });

    // click state, will be used on element out
    const clickState = ref(false);

    // css styles for cursor wrapper element
    const wrapperStyle = computed(() => {
      const baseStyles: Record<string, string | number> = {
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

    // css styles for default circle cursor
    const cursorStyle = computed(() => {
      return {
        'background': props.color,
        'border-width': `${props.borderWidth}px`,
        'border-style': 'solid',
        'border-color': props.borderColor,
        'width': `${props.size}px`,
        'height': `${props.size}px`,
      };
    });

    // css styles for cursor content
    const contentStyle = computed(() => {
      return {
        'position': props.contentPosition === 'center' ?
          'absolute' :
          'center',
      };
    });

    // determine if the component should render on touch-based devices
    const showPointer = (): boolean => {
      const isTouchDevice = () => {
        return window.matchMedia('(pointer: coarse)').matches;
      };

      return !isTouchDevice() || (isTouchDevice() && props.showOnTouch);
    };

    // detect if custom shape is preferred instead
    const isCustomShape = (): boolean => {
      return !!slots.default;
    };

    // getter for wrapper element
    const getWrapperElement = (): HTMLElement => {
      return wrapper.value as HTMLElement;
    };

    // default cursor styling
    const defaultTransformStyle = computed(() => {
      return {
        scale: 1,
        color: props.color,
        borderWidth: props.borderWidth,
        borderColor: props.borderColor,
      };
    });

    // utility function to apply transformation on cursor element
    const applyTransform = (
      ref: TransformProps,
      target: TransformProps,
      pickRef: boolean,
    ): void => {
      const el = cursor.value as HTMLElement;

      const { cssStyles, transitionString } = generateCSSTransform(
        ref,
        target,
        pickRef,
      );

      Object.keys(cssStyles).forEach((prop: string) => {
        el.style[prop] = cssStyles[prop];
      });

      el.style.transition = transitionString;
    };

    /**
     * Begin event listeners part
     * These functions should only be called on mounted-related hooks
     */

    // restore default cursor on mouse out
    const handleMouseOut = (): void => {
      const el = getWrapperElement();
      document.body.style.cursor = 'auto';

      if (props.hideOnOut) {
        el.classList.add('tetikus--leave');
      }

      emit('tetikus-window-leave');
    };

    // hide normal cursor on demand
    const handleMouseOver = (): void => {
      if (!props.showDefaultCursor) {
        document.body.style.cursor = 'none';
      }

      const el = getWrapperElement();

      el.classList.remove('tetikus--leave');

      emit('tetikus-window-enter');
    };

    // change mouse position on mouse movements
    const handleMouseMove = throttle((event: MouseEvent): void => {
      mousePos.x = event.clientX - (props.size / 2);
      mousePos.y = event.clientY - (props.size / 2);

      emit('tetikus-mouse-move', event);
    }, props.throttleSpeed);

    // handle linear interpolation if option is enabled
    const handleLerp = (): void => {
      const el = getWrapperElement();

      // prevent running function on unmounted state
      if (el) {
        const x = lerp(el.style.left, mousePos.x, props.lerp);
        const y = lerp(el.style.top, mousePos.y, props.lerp);

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
      }

      requestAnimationFrame(handleLerp);
    };

    // apply transformation on mouse button press
    const handleMouseDown = (event: MouseEvent): void => {
      const button = buttonMap.get(event.button) as string;

      if (!props.buttonMap.includes(button)) {
        return;
      }

      if (!isCustomShape()) {
        const transformRef = {
          ...hoverState.value?.transformProps || {},
          ...defaultTransformStyle.value,
        };

        const transformTarget = {
          ...defaultTransformStyle.value,
          ...props.clickBehavior,
        };

        applyTransform(transformRef, transformTarget, false);
      }

      clickState.value = true;

      emit('tetikus-mouse-down', event);
    };

    // apply another transform on cursor when mouse button is lifted
    const handleMouseUp = (event: MouseEvent): void => {
      const button = buttonMap.get(event.button) as string;

      if (!props.buttonMap.includes(button)) {
        return;
      }

      if (!isCustomShape()) {
        const { id } = getWrapperElement();
        const { value } = hoverState;
        const shouldTransform = value &&
          (
            !value.transformProps.id ||
            value.transformProps.id === id ||
            value.transformProps.id.includes(id)
          );


        const baseTarget = value && shouldTransform ?
          value.transformProps :
          defaultTransformStyle.value;

        const transformTarget = {
          ...defaultTransformStyle.value,
          ...baseTarget,
        };

        applyTransform(props.clickBehavior, transformTarget, true);
      }

      clickState.value = false;

      emit('tetikus-mouse-up', event);
    };

    // handle cursor props on element hover
    const handleElementIn = (behavior: HoverBehavior): void => {
      if (clickState.value) { // prioritize button clicks
        return;
      }

      const { id } = getWrapperElement();
      const { transformProps } = behavior;
      const shouldTransform = !transformProps.id ||
        transformProps.id === id ||
        transformProps.id.includes(id);


      if (!isCustomShape() && shouldTransform) {
        const transformTarget = {
          ...defaultTransformStyle.value,
          ...transformProps,
        };
        // prevent TetikusWarning error
        delete transformTarget.id;

        applyTransform(defaultTransformStyle.value, transformTarget, false);
      }

      emit('tetikus-element-in', behavior);
    };

    // handle cursor props when the cursor exits Tetikus-hoverable elements
    const handleElementOut = (prevBehavior: HoverBehavior): void => {
      const { id } = getWrapperElement();
      const { transformProps } = prevBehavior;
      const shouldTransform = !transformProps.id ||
        transformProps.id === id ||
        transformProps.id.includes(id);

      if (!isCustomShape() &&
        !clickState.value &&
        shouldTransform
      ) {
        applyTransform(
          prevBehavior.transformProps,
          defaultTransformStyle.value,
          true,
        );
      }

      emit('tetikus-element-out');
    };

    // attach event listeners
    onMounted((): void => {
      if (showPointer()) {
        window.addEventListener('mouseout', handleMouseOut);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousemove', handleMouseMove);

        // add mouse click listener if click behavior is defined
        if (Object.keys(props.clickBehavior).length > 0) {
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

        // remove mouse click listener if click behavior is defined
        if (Object.keys(props.clickBehavior).length > 0) {
          window.removeEventListener('mousedown', handleMouseDown);
          window.removeEventListener('mouseup', handleMouseUp);
        }
      }
    });

    // watch any hover state changes and pass it to correct handlers
    watch(hoverState, (state, prevState): void => {
      if (!state) {
        handleElementOut(prevState as HoverBehavior);
      } else {
        handleElementIn(state);
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
    <div class="tetikus__cursor">
      <slot v-if="isCustomShape()">
      </slot>

      <div
        class="tetikus__default__cursor"
        v-else
        ref="cursor"
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

<style scoped>
.tetikus {
  pointer-events: none;
  position: fixed;
  z-index: 999;
  display: flex;
}

.tetikus--leave {
  display: none;
}

.tetikus__cursor {
  box-sizing: border-box;
}

.tetikus__default__cursor {
  border-radius: 9999px;
  transition: transform 150ms ease-in-out;
  transform: scale(1);
}
</style>
