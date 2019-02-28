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
                var that = this;
                this.axios.get('/api/function/testHeader', {
                    headers: {
                        'Authorization': window.localStorage.Token,
                    }
                })
                    .then(function (response) {
                    })
                    .catch(function (error) {
                        that.error(error.response.data.message);
                        window.localStorage.Token = null
                        that.$router.replace('/Login')
                    });
            },
            error(message) {
                this.$message({
                    showClose: true,
                    message: message,
                    type: 'error'
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>