import { createApp } from 'vue'
import router, {addRoutes} from './router'
import Store from './store'
import App from './App.vue'
import { permission } from "./directives/permission";
import LayJsonSchemaForm from "@layui/json-schema-form";
import {createPinia} from "pinia";

const app = createApp(App)

app.use(createPinia)
app.use(Store);
await addRoutes();
app.use(router);
app.use(LayJsonSchemaForm);
app.directive("permission",permission);
app.mount('#app');
