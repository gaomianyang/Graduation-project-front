<template>
    <div>
        <Header msg="1"></Header>
        <ChangeInfo :infoForm="this.infoForm" ref="ChangeInfo" v-on:refreshInfo="getInfo"></ChangeInfo>
        <br/><br/><br/><br/><br/><br/><br/><br/>
        <div class="infoBody" v-loading="loading">
            <el-form v-if="fromShow" label-suffix="：" class="infoForm" :model="infoForm" ref="infoForm">
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
                <el-form-item label="绑定微信">
                    <span v-if="infoForm.openId" style="float: left">已绑定微信</span>
                    <el-button v-else type="text" style="float: left" @click="wx">未绑定微信,点击绑定</el-button>
                </el-form-item>
            </el-form>
            <br/><br/>
            <el-button type="danger" @click="cancellation" plain round>注销</el-button>
            &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
            <el-button type="primary" @click="show" plain round>修改信息</el-button>
            <br/><br/><br/><br/>

            <el-dialog
                    @closed="reShow"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :before-close="handleClose">
                <!--<el-image-->
                        <!--style="width: 100px; height: 100px"-->
                        <!--src="./img/1.jpg"-->
                        <!--&gt;</el-image>-->
                <img :src="url" height="300px" width="300">
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Header from './LoginHeader.vue'
    import ChangeInfo from './ChangeInfo.vue'
    import ElFormItem from "../../node_modules/element-ui/packages/form/src/form-item";
    export default {
        components: {
            ElFormItem,
            Header,
            ChangeInfo
        },
        name: 'Info',
        created() {
            this.getInfo();
        },
        methods: {
            reShow(){
                this.getInfo();
            },
            wx(){
                var that = this;
                this.axios.get('/api/function/codeImg', {
                    headers: {
                        'Authorization': window.localStorage.Token,
                    }
                })
                    .then(function (response) {
                        that.url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + response.data;
                        that.dialogVisible = true;
                    })
                    .catch(function (error) {
                        that.error(error.response.data.message);
                        window.localStorage.Token = null
                        that.$router.replace('/Login')
                    });
            },
            show() {
                this.$refs.ChangeInfo.show();
            },
            getInfo() {
                this.loading = true;
                var that = this;
                this.axios.get('/api/function/info', {
                    headers: {
                        'Authorization': window.localStorage.Token,
                    }
                })
                    .then(function (response) {
                        that.infoForm = response.data;
                        that.loading = false;
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
                loading: true,
                dialogVisible: false,
                url: '',
                fromShow: true
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