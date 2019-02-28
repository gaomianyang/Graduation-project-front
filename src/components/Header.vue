<template>
    <div>
        <router-link to="/Welcome">
            <a class="logo"><img src="./img/logo.png" height="80px" width="80"></a>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: 'Header',
//        props: {
//            msg: String
//        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .logo{
        margin-left:20%;
    }
    .input{
        width: 400px;
    }
</style>