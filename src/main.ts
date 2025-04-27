import { createApp } from 'vue'
import router from './router'
import Store from './store'
import App from './App.vue'
import { permission } from "./directives/permission";

const app = createApp(App)

app.use(Store);
app.use(router);

app.directive("permission",permission);
app.mount('#app');
