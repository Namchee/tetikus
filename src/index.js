import Tetikus from './component/Tetikus.vue';

export default {
  install(app) {
    app.component('Tetikus', Tetikus);
  }
}

// re-export the component using named export
// just in case someone want to use it in one component
export { Tetikus };
