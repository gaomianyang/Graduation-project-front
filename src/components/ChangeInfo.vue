<template>
    <el-dialog title="信息修改" :visible.sync="dialogFormVisible" center>
        <el-form v-loading="loading" :model="ruleForm" status-icon :rules="registerRules" ref="ruleForm" label-width="100px" style="margin-left: 20%" >
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
            <el-form-item label="姓名">
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
            <el-form-item label="新密码" prop="inputPassWord">
                <el-input
                        class="input"
                        placeholder="请输入密码（不改密码无需填写）"
                        v-model="ruleForm.inputPassWord"
                        clearable
                        :type="ruleForm.ifSee"
                        maxlength="16"
                >
                    <i id="ifSee" slot="prefix" class="el-icon-view" @click="see" style="margin-left: 6px"></i>
                </el-input>
            </el-form-item>
            <br/>
            <el-form-item label="确认新密码" prop="inputCheckPassWord">
                <el-input
                        class="input"
                        placeholder="请再次输入密码（不改密码无需填写）"
                        v-model="ruleForm.inputCheckPassWord"
                        clearable
                        :type="ruleForm.ifSee"
                        maxlength="16"
                >
                    <i id="ifSee2" slot="prefix" class="el-icon-view" @click="see" style="margin-left: 6px"></i>
                </el-input>
            </el-form-item>
            <br/>
            <el-form-item label="所在分组">
                <el-cascader
                        class="input"
                        placeholder="支持搜索"
                        :options="options"
                        filterable
                        v-model="choseValue"
                >
                </el-cascader>
            </el-form-item>
            <br/><br/>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeInfo">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        components: {
        },
        name: 'ChangeInfo',
        props: {
                infoForm: {}
        },
        created() {
            this.getGroupList();
        },
        methods: {
            changeInfo() {
                this.loading = true;
                var that = this;
                this.axios.put('/api/function/info', {
                    phoneNumber: this.ruleForm.phoneNumber,
                    email: this.ruleForm.email,
                    firstName: this.ruleForm.firstName,
                    lastName: this.ruleForm.lastName,
                    groupId: this.choseValue[this.choseValue.length - 1],
                    password: this.ruleForm.inputPassWord
                }, {
                    headers: {
                        'Authorization': window.localStorage.Token
                    }
                })
                    .then(function (response) {
                        that.success("修改成功！");
                        that.ruleForm.inputPassWord = '';
                        that.ruleForm.inputCheckPassWord = '';
                        that.$emit('refreshInfo',null);
                        that.dialogFormVisible = false;
                        that.loading = false;
                    })
                    .catch(function (error) {
                        that.error(error.response.data.message);
                        window.localStorage.Token = null
                        that.$router.replace('/Login')
                    });
            },
            getGroupList() {
                var that = this;
                this.axios.get('/api/function/groupList', {
                    headers: {
                        'Authorization': window.localStorage.Token,
                    }
                })
                    .then(function (response) {
                        that.options = response.data;
                        console.info(that.options);
                    })
                    .catch(function (error) {
                        that.error(error.response.data.message);
                        window.localStorage.Token = null
                        that.$router.replace('/Login')
                    });
            },
            success(message) {
                this.$message({
                    showClose: true,
                    message: message,
                    type: 'success'
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
                if (this.ruleForm.ifSee === ''){
                    this.ruleForm.ifSee = 'password';
                }
                else {
                    this.ruleForm.ifSee = '';
                }
            },
            show() {
                this.ruleForm.firstName = this.infoForm.firstName;
                this.ruleForm.lastName = this.infoForm.lastName;
                this.ruleForm.email = this.infoForm.email;
                this.ruleForm.phoneNumber = this.infoForm.phoneNumber;
                this.dialogFormVisible = true;
            }
        },
        data() {
            var validatePass = (rule, value, callback) => {
                callback();
            };
            var validateCheckPass = (rule, value, callback) => {
                if (value !== this.ruleForm.inputPassWord) {
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
                    inputPassWord: [
                        { validator: validatePass, trigger: 'blur'}
                    ],
                    inputCheckPassWord: [
                        { validator: validateCheckPass, trigger: 'blur'}
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
                    phoneNumber: '',
                    email: '',
                    inputPassWord: '',
                    inputCheckPassWord: '',
                    ifSee: 'password',
                    ifRegister: false,
                    firstName: '',
                    lastName: ''
                },
                dialogFormVisible: false,
                options: [],
                choseValue: '',
                loading: false
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