import Vue from 'vue'
import Settings from '../../views/Setting'
import '../../quasar'
import { Button, Select, Input} from 'element-ui';
// import App from './App.vue'
Vue.config.productionTip = false

Vue.use(Button);
Vue.use(Select);
Vue.use(Input);

new Vue({
    render: h => h(Settings)
}).$mount('#app')