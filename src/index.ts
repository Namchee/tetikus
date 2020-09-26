import Tetikus from './components/Tetikus';
import { TetikusHover } from './directives/hover';
import {
  defaultTransitionSpeed,
  defaultEasingFunction,
  defaultDelay,
} from './components/Tetikus/options';
import { ConstructorOptions } from './common/types';
import { App } from 'vue';

export default {
  install(
    app: App,
    { directiveName, transitionSpeed, easing, delay }: ConstructorOptions = {},
  ) {
    app.component('Tetikus', Tetikus);
    app.directive(directiveName || 'thover', TetikusHover);

    if (transitionSpeed) {
      defaultTransitionSpeed.value = transitionSpeed;
    }

    if (easing) {
      defaultEasingFunction.value = easing;
    }

    if (delay) {
      defaultDelay.value = delay;
    }
  },
};


// re-export the components, directives, and options using named export
// just in case someone hates global installation (:
export {
  Tetikus,
  TetikusHover,
  defaultTransitionSpeed,
  defaultEasingFunction,
  defaultDelay,
};
