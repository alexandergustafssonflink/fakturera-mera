<template>
    <div class="cookie-banner">
        <h4 class="q-mb-sm">Om kakor...</h4>
        <p>Vi använder cookies för att förbättra din upplevelse genom att komma ihåg att du har loggat in. </p>
        <q-btn label="Jag är okej med detta och i annat fall kan jag välja att ej använda tjänsten" class="q-ml-lg" no-caps color="primary" outline @click="$emit('approveCookies')"></q-btn>
    </div>
</template>

<script>
export default {
    name: 'CookieBanner',
    components: {
    },
    methods: {
    },
    created() {
    }
}
</script>

<style scoped>
    .cookie-banner {
        width: 100vw; 
        background: whitesmoke;
        color: black;
        height: 200px;
        position: fixed;
        left: 0px;
        bottom: 0px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
    }

</style>
