import { DirectiveBinding, ref, Ref, VNode } from 'vue';
import { HoverBehavior, TransformProps } from './../common/types';

export const hoverState: Ref<HoverBehavior | null> = ref(null);

const updateHoverState = (props: TransformProps = {}, vnode: VNode) => {
  if (!props) {
    return;
  }

  const state: HoverBehavior = {
    transformProps: props,
    domElement: vnode.el as HTMLElement,
  };

  hoverState.value = state;
};

const clearHoverState = () => {
  hoverState.value = null;
};

export const TetikusHover = {
  mounted(
    el: HTMLElement,
    { value: props }: DirectiveBinding<TransformProps>,
    vnode: VNode,
  ) {
    el.style.cursor = 'none'; // favor tetikus beautiful cursor

    el.addEventListener(
      'mouseover',
      () => updateHoverState(props, vnode),
    );

    el.addEventListener('mouseleave', clearHoverState);
  },

  beforeUnmount(
    el: HTMLElement,
    { value: props }: DirectiveBinding<TransformProps>,
    vnode: VNode,
  ) {
    el.style.cursor = 'auto';

    el.removeEventListener(
      'mouseover',
      () => updateHoverState(props, vnode),
    );

    el.removeEventListener('mouseout', clearHoverState);
  },
};
