<template>
  <div class="container">
    <h1>HOME!</h1>
  </div>
</template>

<script>
//import axios from "axios";
// import store from "./store";

export default {
    name: 'Home',
    components: {
    },
    methods: {
    },
    created() {
        this.$router.push("/invoices")
    }
}
</script>

<style>

</style>
