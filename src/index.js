import Tetikus from '@/component/Tetikus';
import { defaultTransitionSpeed, defaultEasingFunction, defaultDelay } from '@/components/Tetikus/options';

export default {
  install(app, { transitionSpeed, easing, delay }) {
    app.component('Tetikus', Tetikus);

    if (transitionSpeed) {
      defaultTransitionSpeed.value = transitionSpeed;
    }

    if (easing) {
      defaultEasingFunction.value = easing;
    }

    if (delay) {
      defaultDelay.value = delay;
    }
  }
}

// re-export the component using named export
// just in case someone want to use it in one component
export { Tetikus };
