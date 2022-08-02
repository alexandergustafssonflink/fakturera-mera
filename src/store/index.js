import { createStore } from "vuex";
// import setTokenExpiration, { hasExpired } from "@/plugins/token-expiration";

export default createStore({
    state() {
        return {
            token: "",
            isLoggedIn() {
                if(localStorage.token) {
                    return true
                } else {
                    return false
                }
            }
        };
    },
    getters: {
    },
    mutations: {
        login(state, token) {
            state.token = token;
            console.log("HEJ");
            
            
            // setTokenExpiration(token);
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
