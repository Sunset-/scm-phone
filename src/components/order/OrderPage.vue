<template>
    <div id="app">
            <Orders></Orders>
    </div>
</template>
<script>
    import Orders from './Orders.vue';

    export default {
        components: {
            Orders
        },
        data() {
            return {}
        },
        methods: {},
        ready() {}
    }
</script>
<style>
    body {
        font-family: Helvetica, sans-serif;
    }
</style>