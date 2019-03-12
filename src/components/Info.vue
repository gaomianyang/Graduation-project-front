<template>
    <div>
        <Header></Header>
        <div class="body">
            <br/><br/><br/><br/><br/><br/>
            <el-form :model="infoForm" ref="infoForm">
                <el-form-item>
                    账号： {{infoForm.userName}}
                </el-form-item>
                <el-form-item>
                    姓氏： {{infoForm.firstName}}
                </el-form-item>
                <el-form-item>
                    名字： {{infoForm.lastName}}
                </el-form-item>
                <el-form-item>
                    电话号码： {{infoForm.phoneNumber}}
                </el-form-item>
                <el-form-item>
                    电子邮箱： {{infoForm.email}}
                </el-form-item>
                <el-button type="danger" @click="cancellation"  round>注销</el-button>
                <el-button type="primary" @click="testHeader" plain round>TestHeard</el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Header from './LoginHeader.vue'
    export default {
        components: {
            Header
        },
        name: 'Info',
        mounted() {
            this.getInfo();
        },
        methods: {
            getInfo() {
                var that = this;
                this.axios.get('/api/function/getInfo', {
                    headers: {
                        'Authorization': window.localStorage.Token,
                    }
                })
                    .then(function (response) {
                        that.infoForm = response.data;
                    })
                    .catch(function (error) {
                        that.error(error.response.data.message);
                        window.localStorage.Token = null
                        that.$router.replace('/Login')
                    });
            },
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
        },
        data() {
            return {
                infoForm: {
                    userName: '',
                    phoneNumber: '',
                    email: '',
                    firstName: '',
                    lastName: ''
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>