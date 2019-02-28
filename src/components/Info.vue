<template>
    <div>
        SUCCESS!!!
        <el-button type="primary" @click="cancellation" plain round>注销</el-button>
        <el-button type="primary" @click="testHeader" plain round>TestHeard</el-button>
    </div>
</template>

<script>
    export default {
        name: 'Info',
        methods: {
            cancellation() {
                window.localStorage.Token = null
                this.$router.replace('/Login')
            },
            testHeader() {
                this.axios.get('/api/SqlTest/testHeader', {
                    headers: {
                        'Authorization': window.localStorage.Token,
                    }
                })
                    .then(function (response) {
                    })
                    .catch(function (error) {
                    });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>