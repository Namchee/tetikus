import { DirectiveArguments, DirectiveBinding } from 'vue';

const handleElementHover = (e: MouseEvent, props?: string) => {

}

export const TetikusHover = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    el.addEventListener(
      'mouseenter',
      (e: MouseEvent) => handleElementHover(e, binding.arg),
    );
  },

  beforeUnmount(el: HTMLElement, binding: DirectiveBinding) {
    el.removeEventListener(
      'mouseenter',
      (e: MouseEvent) => handleElementHover(e, binding.arg),
    );
  },
};
