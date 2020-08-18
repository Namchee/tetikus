import { DirectiveBinding, ref, Ref, VNode } from 'vue';
import { TransformProperties, HoverState } from '@/types';

export const hoverState: Ref<HoverState | null> = ref(null);

const handleElementHover = (props: TransformProperties, vnode: VNode) => {
  const state: HoverState = {
    transformProps: props,
  };

  hoverState.value = state;
}

export const TetikusHover = {
  mounted(
    el: HTMLElement,
    binding: DirectiveBinding<TransformProperties>,
    vnode: VNode,
  ) {
    el.addEventListener(
      'mouseenter',
      () => handleElementHover(binding.value, vnode),
    );
  },

  beforeUnmount(
    el: HTMLElement,
    binding: DirectiveBinding<TransformProperties>,
    vnode: VNode,
  ) {
    el.removeEventListener(
      'mouseenter',
      () => handleElementHover(binding.value, vnode),
    );
  },
};
