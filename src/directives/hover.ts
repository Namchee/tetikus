import { DirectiveBinding, ref, Ref, VNode } from 'vue';

export const hoverState: Ref<HoverBehavior | null> = ref(null);

const updateHoverState = (props: TransformProperties, vnode: VNode) => {
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
    binding: DirectiveBinding<TransformProperties>,
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
    binding: DirectiveBinding<TransformProperties>,
    vnode: VNode,
  ) {
    el.removeEventListener(
      'mouseover',
      () => updateHoverState(binding.value, vnode),
    );

    el.removeEventListener('mouseout', clearHoverState);
  },
};
