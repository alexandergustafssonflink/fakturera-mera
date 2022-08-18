<template>
<div class="box">
    <div v-if="respons">
        <q-btn no-caps color="primary" @click="$router.push('/login')">Logga in</q-btn>
        <h6>{{respons.data}}</h6>
    </div>
    <div v-else>
        <h6>{{error.response.data.error}}</h6>
    </div>
</div>
</template>

<script>
import axios from "axios";
export default {
    name: 'VerifyEmail',
    components: {
    },
    methods: {
    },
    data() {
        return {
            isLoading: Boolean,
            showVerifyMessage: false,
            error: "",
            respons: ""
        };
    },
    async created() {
        const userId = this.$route.fullPath.split("/verify-email/")[1]
        try {
            this.respons = await axios.post(process.env.VUE_APP_API_URL + "/user/verify-email", {userId});
        } catch (error) {
            this.error = error;
        }
    }
}
</script>

<style scoped>

.box {
    /* display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    margin-top: 50px; */
}
.wrapper {
    min-width: 300px;
    max-width: 500px;
}

.error {
    padding: 1em; 
    background-color: #E36565;
    color: white;
    font-weight: 700;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

.error p {
    margin: 6px 0 0 0;
}
</style>
