<template>
    <div>
    <Header></Header>
    <div style="margin:0 auto; width:600px;">
        <br/><br/><br/><br/><br/>
        <br/><br/><br/><br/><br/>
        <el-form label-width="80px" :model="loginForm" ref="loginForm">
            <el-form-item prop="inputUserName" :rules="{
      required: true, message: '账号不能为空', trigger: 'blur'
    }">
                <el-input
                        class="input"
                        placeholder="请输入账号/邮箱/手机号"
                        v-model="loginForm.inputUserName"
                        clearable
                        maxlength="16"
                        prefix-icon="el-icon-mobile-phone">
                </el-input>
            </el-form-item>
            <br/>
            <el-form-item prop="inputPassWord" :rules="{
      required: true, message: '密码不能为空', trigger: 'blur'
    }">
                <el-input
                        class="input"
                        placeholder="请输入密码"
                        v-model="loginForm.inputPassWord"
                        clearable
                        :type="loginForm.ifSee"
                        maxlength="16"
                        prefix="el-icon-view">
                    <i id="ifSee" slot="prefix" class="el-icon-view" @click="see" style="margin-left: 6px"></i>
                </el-input>
            </el-form-item>
            <br/><br/>
            <el-form-item style="margin: 0 auto; text-align: center" label-width="-40px">
                <el-row>
                    <el-button type="primary" @click="login" plain round>登录</el-button>
                    &nbsp&nbsp&nbsp&nbsp
                    <router-link to="/Register">
                        <el-button type="primary" plain round>注册</el-button>
                    </router-link>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
    </div>
</template>

<script>
    import Header from './Header.vue'

    export default {
        components: {
            Header
        },
        name: 'Login',
        props: {
            msg: String
        },
        methods: {
            login() {
                var that = this
                if(this.loginForm.inputUserName === ''){
                    this.error('请填写账号');
                    return false;
                }
                if(this.loginForm.inputPassWord === ''){
                    this.error('请填写密码');
                    return false;
                }
                this.axios.post('/api/SqlTest/login', {
                    userName: this.loginForm.inputUserName,
                    password: this.loginForm.inputPassWord
                })
                    .then(function (response) {
                        if (null != response.data)
                        {
                            window.localStorage.Token = response.data
                            that.$router.replace('/Info')
                        }
                    })
                    .catch(function (error) {
                        that.error('账号或密码错误')
                    });
            },
            error(message) {
                this.$message({
                    showClose: true,
                    message: message,
                    type: 'error'
                });
            },
            see() {
                if (this.loginForm.ifSee === ''){
                    this.loginForm.ifSee = 'password'
                }
                else {
                    this.loginForm.ifSee = ''
                }
            }
        },
        data() {
            return {
                loginForm: {
                    inputUserName: '',
                    inputPassWord: '',
                    ifSee: 'password'
                }
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
