import { createApp } from 'vue';
import Tetikus from './../index.js';
import App from './App.vue';

const app = createApp(App);
app.use(Tetikus);

app.mount('#app');
