import { createApp } from 'vue'
import App from './App.vue'
import quasarUserOptions from './quasar-user-options'
import { Quasar } from "quasar"
import { createStore } from "vuex";
import router from "./router/index.js";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
    state() {
        return {
            token: "",
            isLoggedIn() {
                if(this.token) {
                    return true
                } else {
                    return false;
                }
            }
        };
    },
    plugins: [createPersistedState()],
    getters: {
    },
    mutations: {
        login(state, token) {
            state.token = token;
            console.log("HEJ");
        },
        clearUser(state) {
            state.token = "";
        },

    },
    actions: {
    },
    modules: {
    }
});

createApp(App).use(router).use(store).use(Quasar, quasarUserOptions).mount('#app')



//   app.use(store);
