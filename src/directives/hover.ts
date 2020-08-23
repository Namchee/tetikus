import { DirectiveBinding, ref, Ref, VNode } from 'vue';
import { HoverBehavior, TransformProps } from '../types';

export const hoverState: Ref<HoverBehavior | null> = ref(null);

const updateHoverState = (props: TransformProps, vnode: VNode) => {
  const state: HoverBehavior = {
    transformProps: props,
    domElement: vnode.el as HTMLElement,
  };

  hoverState.value = state;
}

const clearHoverState = () => {
  hoverState.value = null;
};

export const TetikusHover = {
  mounted(
    el: HTMLElement,
    binding: DirectiveBinding<TransformProps>,
    vnode: VNode,
  ) {
    el.addEventListener(
      'mouseover',
      () => updateHoverState(binding.value, vnode),
    );

    el.addEventListener('mouseleave', clearHoverState);
  },

  beforeUnmount(
    el: HTMLElement,
    binding: DirectiveBinding<TransformProps>,
    vnode: VNode,
  ) {
    el.removeEventListener(
      'mouseover',
      () => updateHoverState(binding.value, vnode),
    );

    el.removeEventListener('mouseout', clearHoverState);
  },
};
