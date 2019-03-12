<template>
    <div class="logo">
        <router-link to="/Welcome">
            <a><img src="./img/logo.png" height="80px" width="80"></a>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: 'Header',
//        props: {
//            msg: String class="logo"
//        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .logo{
        margin-left:20%;
    }
</style>