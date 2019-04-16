<template>
    <div>
        <Header msg="1"></Header>
        <ChangeInfo :infoForm="this.infoForm" ref="ChangeInfo" v-on:refreshInfo="getInfo"></ChangeInfo>
        <br/><br/><br/><br/><br/><br/><br/><br/>
        <div class="infoBody">
            <el-form label-suffix="：" class="infoForm" :model="infoForm" ref="infoForm" >
                <br/><br/>
                <el-form-item label="账号">
                    <span style="float: left">{{infoForm.userName}}</span>
                </el-form-item>
                <el-form-item label="姓氏">
                    <span style="float: left">{{infoForm.firstName}}</span>
                </el-form-item>
                <el-form-item label="名字">
                   <span style="float: left">{{infoForm.lastName}}</span>
                </el-form-item>
                <el-form-item label="电话号码">
                   <span style="float: left">{{infoForm.phoneNumber}}</span>
                </el-form-item>
                <el-form-item label="电子邮箱">
                   <span style="float: left">{{infoForm.email}}</span>
                </el-form-item>
                <el-form-item label="所在分组">
                   <span style="float: left">{{infoForm.groupName}}</span>
                </el-form-item>
            </el-form>
            <br/><br/>
            <el-button type="danger" @click="cancellation" plain round>注销</el-button>
            &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
            <el-button type="primary" @click="show" plain round>修改信息</el-button>
            <br/><br/><br/><br/>
        </div>
    </div>
</template>

<script>
    import Header from './LoginHeader.vue'
    import ChangeInfo from './ChangeInfo.vue'
    export default {
        components: {
            Header,
            ChangeInfo
        },
        name: 'Info',
        created() {
            this.getInfo();
        },
        methods: {
            show() {
                this.$refs.ChangeInfo.show();
            },
            getInfo() {
                var that = this;
                this.axios.get('/api/function/info', {
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
                    lastName: '',
                    groupName: ''
                },
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .infoBody{
        margin: 0 auto;
        text-align: center;
        width: 60%;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        color: #606266;
    }
    .infoForm{
        margin-left: 35%;
        width:1000px;
    }
</style>