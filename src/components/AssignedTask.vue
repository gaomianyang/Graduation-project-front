<template>
    <el-dialog
            title="指派用户"
            :visible.sync="centerDialogVisible"
            width="40%"
            center>
        <el-transfer
                v-loading="loading"
                style="margin-left: 82px"
                :titles="['查询用户', '指派用户']"
                :button-texts="['删除指派', '增加指派']"
                v-model="value"
                :data="data">
            <el-input
                    placeholder="根据姓氏或者名字查询"
                    v-model="query"
                    slot="left-footer"
                    @change="queryChange"
                    clearable>
            </el-input>
        </el-transfer>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submission">提 交</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import ElButton from "../../node_modules/element-ui/packages/button/src/button";
    export default {
        components: {
            ElButton
        },
        name: 'AssignedTask',
        props: {
            involvedPeople: []
        },
        created() {
        },
        methods: {
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
            queryChange() {
                if (this.query !== '') {
                    var that = this;
                    var deleteData = [];
                    var ifDelete = true;
                    this.loading = true;
                    this.data.forEach((user, index)=>{
                        that.value.forEach(userId => {
                            if(userId === user.key){
                                ifDelete = false;
                            }
                        })
                        that.thisInvolvedPeople.forEach(item => {
                            if (item.key === user.key){
                                ifDelete = false;
                            }
                        })
                        if (ifDelete){
                            deleteData.unshift(index);
                        }
                        ifDelete = true;
                    });
                    deleteData.forEach(deleteData => {
                        that.data.splice(deleteData, 1);
                    })
                    this.axios.get('/api/function/user?excludeTaskId=' + this.excludeTaskId + '&filter=' + this.query, {
                        headers: {
                            'Authorization': window.localStorage.Token
                        }
                    })
                        .then(function (response) {
                            var ifPush = true;
                            if (response.data.size > 0) {
                                response.data.data.forEach((taskUser) => {
                                    that.data.forEach(item => {
                                        if(item.key === taskUser.id){
                                            ifPush = false;
                                        }
                                    })
                                    if (ifPush){
                                        that.data.push({
                                            label: taskUser.firstName + " " + taskUser.lastName,
                                            key: taskUser.id
                                        })
                                    }
                                    ifPush = true;
                                })
                            }
                            that.loading = false;
                        })
                        .catch(function (error) {
                            that.error(error.response.data.message);
                            window.localStorage.Token = null;
                            that.$router.replace('/Login');
                        });
                }
            },
            submission() {
                var requestNumber = 0;
                var removeInvolved = [];
                var that = this;
                var deleteInvolved = [];
                var deleteValue = [];
                this.loading = true;
                this.thisInvolvedPeople.forEach((involverPeople, invoIndex)=>{
                    this.value.forEach((value, valIndex)=>{
                        if(value === involverPeople.key){
                            deleteInvolved.unshift(invoIndex);
                            deleteValue.unshift(valIndex);
                        }
                    });
                });
                deleteInvolved.forEach(deleteInvolved => {
                    that.thisInvolvedPeople.splice(deleteInvolved, 1);
                });
                deleteValue.forEach(deleteValue => {
                    that.value.splice(deleteValue, 1);
                });
                this.thisInvolvedPeople.forEach((involverPeople)=>{
                    removeInvolved.push(involverPeople.key);
                });
                this.axios.put('/api/function/involved',
                    {
                        invoUserIds: that.value,
                        type: 'involve',
                        taskId: that.excludeTaskId
                    }, {
                        headers: {
                            'Authorization': window.localStorage.Token
                        }
                    })
                    .then(function (response) {
                        requestNumber ++;
                        if (requestNumber === 2){
                            that.success("提交成功");
                            that.loading = false;
                            that.centerDialogVisible = false;
                        }
                    })
                    .catch(function (error) {
                        that.error(error.response.data.message);
                        window.localStorage.Token = null;
                        that.$router.replace('/Login');
                    });
                this.axios.put('/api/function/involved',
                    {
                        invoUserIds: removeInvolved,
                        type: 'remove-involved',
                        taskId: that.excludeTaskId
                    }, {
                        headers: {
                            'Authorization': window.localStorage.Token
                        }
                    })
                    .then(function (response) {
                        requestNumber ++;
                        if (requestNumber === 2){
                            that.success("提交成功");
                            that.loading = false;
                            that.centerDialogVisible = false;
                        }
                    })
                    .catch(function (error) {
                        that.error(error.response.data.message);
                        window.localStorage.Token = null;
                        that.$router.replace('/Login');
                    });
            },
            show(excludeTaskId) {
                this.query = '';
                this.value = [];
                this.data = [];
                this.excludeTaskId = excludeTaskId;
                this.thisInvolvedPeople = this.involvedPeople;
                this.thisInvolvedPeople.forEach((involvedPeople)=>{
                    this.data.push(
                        {
                            label: involvedPeople.label,
                            key: involvedPeople.key
                        });
                    this.value.push(involvedPeople.key);
                })
                this.centerDialogVisible = true;
            },
        },
        data() {
            return {
                excludeTaskId: '',
                centerDialogVisible: false,
                data: [],
                value: [],
                query: '',
                loading: false,
                thisInvolvedPeople: []
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>