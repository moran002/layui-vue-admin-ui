import { createApp } from 'vue'
import router, {addRoutes} from './router'
import Store from './store'
import App from './App.vue'
import { permission } from "./directives/permission";
import {createPinia} from "pinia";

const app = createApp(App)

app.use(createPinia)
app.use(Store);
await addRoutes();
app.use(router);
app.directive("permission",permission);
app.mount('#app');
