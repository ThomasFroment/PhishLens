import { createApp } from "vue";
import "./index.css";
import App from "./App.vue";
import FloatingVue, { vTooltip } from "floating-vue";
import "floating-vue/dist/style.css";

const app = createApp(App);

app.directive("tooltip", vTooltip);

app.use(FloatingVue, {
    themes: {
        "btn-tooltip": {
            $extend: "tooltip",
            $resetCss: true
        }
    }
});

app.mount("#app");
