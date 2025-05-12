import { createApp } from "vue";
import "floating-vue/dist/style.css";
import "./index.css";
import App from "./App.vue";
import FloatingVue from "floating-vue";
import VChart from "vue-echarts";

const app = createApp(App);

app.component("v-chart", VChart);

app.use(FloatingVue, {
    themes: {
        "btn-tooltip": {
            $extend: "tooltip",
            $resetCss: true,
            delay: {
                show: 700,
                hide: 0
            },
            placement: "bottom"
        },
        "chart-dropdown": {
            $extend: "dropdown",
            $resetCss: true,
            overflowPadding: 30,
            placement: "right-start"
        }
    }
});

app.mount("#app");
