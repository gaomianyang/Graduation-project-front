<template>
    <div>
        <router-link to="/Welcome">
            <a class="logo"><img src="./img/logo.png" height="80px" width="80"></a>
        </router-link>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <div style="text-align: center">
            <el-form ref="form">
                <el-form-item>
                    <el-input
                            class="input"
                            placeholder="请输入账号/邮箱/手机号"
                            v-model="inputUserName"
                            clearable
                            maxlength="16"
                            prefix-icon="el-icon-mobile-phone">
                    </el-input>
                </el-form-item>
                <br/>
                <el-form-item>
                    <el-input
                            class="input"
                            placeholder="请输入密码"
                            v-model="inputPassWord"
                            clearable
                            type="password"
                            maxlength="16"
                            prefix-icon="el-icon-view">
                    </el-input>
                </el-form-item>
                <br/><br/>
                <el-form-item>
                    <el-row>
                        <el-button type="primary" @click="login" plain round>Login</el-button>&nbsp&nbsp&nbsp&nbsp
                        <el-button type="primary" plain round>Register</el-button>
                    </el-row>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Login',
        props: {
            msg: String
        },
        methods: {
            login() {
                var that = this
                this.$axios.post('/api/SqlTest/findOne', {
                    userName: that.inputUserName,
                    password: that.inputPassWord
                })
                    .then(function (response) {
                        console.log("返回结果：");
                        console.log(response.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
        data() {
            return {
                inputUserName: '',
                inputPassWord: ''
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .logo{
        margin-left:300px;
    }
    .input{
        width: 400px;
    }
</style>
