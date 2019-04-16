<template>
    <div>
        <Header></Header>
        <div style="margin:0 auto; width:600px;">
            <br/><br/><br/><br/><br/>
            <el-form :model="ruleForm" status-icon :rules="registerRules" ref="ruleForm" label-width="100px" >
                <el-form-item label="账号" prop="inputUserName" >
                    <el-input
                            class="input"
                            placeholder="请输入学号/工号"
                            v-model="ruleForm.inputUserName"
                            clearable
                            maxlength="16"
                            prefix-icon="el-icon-menu">
                    </el-input>
                </el-form-item>
                <br/>
                <el-form-item label="电话" prop="phoneNumber" >
                    <el-input
                            class="input"
                            placeholder="请输入电话号码"
                            v-model.number="ruleForm.phoneNumber"
                            clearable
                            maxlength="11"
                            prefix-icon="el-icon-mobile-phone">
                    </el-input>
                </el-form-item>
                <br/>
                <el-form-item label="电子邮箱" prop="email">
                    <el-input
                            class="input"
                            placeholder="请输入电子邮箱"
                            v-model="ruleForm.email"
                            clearable
                            maxlength="40"
                            prefix-icon="el-icon-message">
                    </el-input>
                </el-form-item>
                <br/>
                <el-form-item label="姓名" prop="nameForm">
                    <el-input
                            class="firstNameInput"
                            placeholder="请输入姓氏"
                            v-model="ruleForm.firstName"
                            clearable
                            maxlength="2">
                    </el-input>
                    &nbsp&nbsp&nbsp
                    <el-input
                            class="lastNameInput"
                            placeholder="请输入名字"
                            v-model="ruleForm.lastName"
                            clearable
                            maxlength="4">
                    </el-input>
                </el-form-item>
                <br/>
                <el-form-item label="密码" prop="inputPassWord">
                    <el-input
                            class="input"
                            placeholder="请输入密码"
                            v-model="ruleForm.inputPassWord"
                            clearable
                            :type="ruleForm.ifSee"
                            maxlength="16">
                        <i id="ifSee" slot="prefix" class="el-icon-view" @click="see" style="margin-left: 6px"></i>
                    </el-input>
                </el-form-item>
                <br/>
                <el-form-item label="确认密码" prop="inputCheckPassWord">
                    <el-input
                            class="input"
                            placeholder="请再次输入密码"
                            v-model="ruleForm.inputCheckPassWord"
                            clearable
                            :type="ruleForm.ifSee"
                            maxlength="16">
                        <i id="ifSee2" slot="prefix" class="el-icon-view" @click="see" style="margin-left: 6px"></i>
                    </el-input>
                </el-form-item>
                <br/><br/>
                <el-form-item style="margin: 0 auto; text-align: center" label-width="-50px">
                    <el-button type="primary" @click="submitForm('ruleForm')" plain round :disabled="ruleForm.ifRegister">注册</el-button>
                    &nbsp&nbsp&nbsp&nbsp
                    <el-button type="primary" @click="resetForm('ruleForm')" plain round>重置</el-button>
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
        name: 'Register',
        props: {
            msg: String
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ruleForm.ifRegister = true;
                        this.register();
                    } else {
                        this.error('请正确填写相关信息');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            register() {
                var that = this;
                this.axios.post('/api/user/register', {
                    userName: this.ruleForm.inputUserName,
                    password: this.ruleForm.inputPassWord,
                    email: this.ruleForm.email,
                    phoneNumber: this.ruleForm.phoneNumber,
                    firstName: this.ruleForm.firstName,
                    lastName: this.ruleForm.lastName
                })
                    .then(function (response) {
                        if ('OK' === response.data)
                        {
                            that.success('注册成功')
                            that.$router.replace('/Login');
                        }
                    })
                    .catch(function (error) {
                        that.error(error + '   注册失败');
                        that.$router.replace('/Login');
                    });
            },
            error(message) {
                this.$message({
                    showClose: true,
                    message: message,
                    type: 'error'
                });
            },
            success(message) {
                this.$message({
                    showClose: true,
                    message: message,
                    type: 'success'
                });
            },
            see() {
                if (this.ruleForm.ifSee === ''){
                    this.ruleForm.ifSee = 'password';
                }
                else {
                    this.ruleForm.ifSee = '';
                }
            }
        },
        data() {
            var validateUserName = (rule, value, callback) => {
                var that = this;
                if (value === '') {
                    callback(new Error('请输入账号'));
                } else {
                    this.axios.get('/api/user/checkUserName?userName=' + this.ruleForm.inputUserName)
                        .then(function (response) {
                            if (true == response.data) {
                                callback(new Error('账号已存在'));
                            }
                            else {
                                callback();
                            }
                        })
                        .catch(function (error) {
                            that.$message({
                                showClose: true,
                                message: error + '   连接失败',
                                type: 'error'
                            });
                        });
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            var validateCheckPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.inputPassWord) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            var validateCheckPhone = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入电话号码'));
                } else {
                    if (isNaN(value)) {
                        callback(new Error('请输入正确电话号码!'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                registerRules: {
                    inputUserName: [
                        { validator: validateUserName, trigger: 'blur', required: true }
                    ],
                    inputPassWord: [
                        { validator: validatePass, trigger: 'blur', required: true }
                    ],
                    inputCheckPassWord: [
                        { validator: validateCheckPass, trigger: 'blur', required: true }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    phoneNumber: [
                        { validator: validateCheckPhone, trigger: 'blur', required: true }
                    ]
                },
                ruleForm: {
                    inputUserName: '',
                    phoneNumber: '',
                    email: '',
                    inputPassWord: '',
                    inputCheckPassWord: '',
                    ifSee: 'password',
                    ifRegister: false,
                    firstName: '',
                    lastName: ''
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
    .firstNameInput{
        width: 150px;
    }
    .lastNameInput{
        width: 230px;
    }
</style>
