<template>
    <div>
    <Header></Header>
        <div style="margin:0 auto; width:600px;">
            <br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/>
            <el-form label-width="80px" :model="loginForm" ref="loginForm">
                <el-form-item prop="inputUserName" :rules="{
          required: true, message: '用户名不能为空', trigger: 'blur'
        }">
                    <el-input
                            class="input"
                            placeholder="请输入账号"
                            v-model="loginForm.inputUserName"
                            clearable
                            maxlength="16"
                            prefix-icon="el-icon-menu">
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
                            maxlength="16">
                        <i id="ifSee" slot="prefix" class="el-icon-view" @click="see" style="margin-left: 6px"></i>
                    </el-input>
                </el-form-item>
                <br/>
                <el-form-item>
                    <el-input
                            class="verInput"
                            placeholder="请输入校验码"
                            v-model="loginForm.verCode"
                            clearable
                            maxlength="4"
                            style="bottom: 14px">
                    </el-input>
                    &nbsp&nbsp&nbsp&nbsp&nbsp
                    <img :src="loginForm.imgBase64" @click="getVerCode">
                </el-form-item>
                <br/>
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
    import Store from '@/vuex/store'
//    import ElFormItem from "../../node_modules/element-ui/packages/form/src/form-item";

    export default {
        components: {
//            ElFormItem,
            Header
        },
        name: 'Login',
        props: {
            msg: String
        },
        created() {
            this.getVerCode();
        },
        methods: {
            loginActiviti(){
                var that = this;
                this.axios.post('/admin/activiti-app/app/authentication', 'j_username=admin&j_password=' + this.loginForm.adminPassword + '&_spring_security_remember_me=true&submit=Login'
                )
                    .then(function (response) {
                        if(that.loginForm.adminPassword !== ''){
                            window.location.href = 'http://localhost:8080/activiti-app/#/';
                        }
                    })
                    .catch(function (error) {
                        that.error("工作流引擎故障...");
                    });
            },
            getVerCode() {
                var that = this;
                this.axios.get('/api/user/getImg')
                    .then(function (response) {
                        that.loginForm.imgBase64 = 'data:image/gif;base64,'+response.data.img;
                        that.loginForm.imgCode = response.data.code;
                    })
                    .catch(function (error) {
                        that.error('效验码获取失败,请刷新重试');
                    });
            },
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
                this.axios.post('/api/user/login', {
                    userName: this.loginForm.inputUserName,
                    password: this.loginForm.inputPassWord,
                    imgCode: this.loginForm.imgCode,
                    verCode: this.loginForm.verCode
                })
                    .then(function (response) {
                        if (response.data.ifAdmin) {
                            that.loginForm.adminPassword = response.data.adminPassword;
                            that.loginActiviti();
                        }
                        if (null != response.data) {
                            window.localStorage.Token = response.data;
                            that.$router.replace('/Info');
                        }
                    })
                    .catch(function (error) {
                        if(error.response.data.message === 'No value present'){
                            that.error("账号或密码错误！");
                        } else {
                            that.error(error.response.data.message);
                        }
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
                    ifSee: 'password',
                    imgBase64: '',
                    imgCode: '',
                    verCode:'',
                    adminPassword: ''
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .input{
        width: 400px;
    }
    .verInput{
        width: 250px;
    }
</style>
