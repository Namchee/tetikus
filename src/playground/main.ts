import { createApp } from 'vue';
import Tetikus from './../index.js';
import './style.css';
import App from './App.vue';

const app = createApp(App);
app.use(Tetikus);

app.mount('#app');
