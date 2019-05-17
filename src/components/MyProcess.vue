<template>
    <div>
        <Header msg="4"></Header>
        <AssignedTask :involvedPeople="involvedPeople" ref="AssignedTask"></AssignedTask>
        <div class="body">
            <div v-loading="taskLoading" style="float: left">
                <el-table
                        v-loading="loading"
                        :data="tableDate"
                        height="820px"
                        border
                        style="width: 251px"
                        :row-class-name="tableRowClassName"
                        @row-click="handleClick">
                    <el-table-column
                            prop="name"
                            width="250">
                        <template slot="header" slot-scope="scope">
                            <span>我的流程</span>
                            <el-button size="small" type="text" @click="stateClick" style="float: right; margin-right: 10px">{{stateShow}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-loading="bodyLoading" style="float: left; width: 600px; margin-left: 4%; margin-top: 50px; max-height: 770px;">
                <el-table
                        v-if="showBody"
                        :data="completedTableDate"
                        style="width: 120px"
                        @row-click="completedHandleClick">
                    <el-table-column
                            prop="name"
                            label="已完成任务：">
                    </el-table-column>
                </el-table>
                <el-table
                        v-if="showBody"
                        :data="runningTableDate"
                        style="width: 120px"
                        @row-click="runningHandleClick">
                    <el-table-column
                            prop="name"
                            label="未完成任务：">
                    </el-table-column>
                </el-table>
                <br/>
                <span style="float: left" v-if="processCreater !== ''">流程创建人: {{ this.processCreater }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from './LoginHeader.vue'
    import AssignedTask from './AssignedTask.vue'
    export default {
        components: {
            Header,
            AssignedTask
        },
        name: 'MyProcess',
        created() {
            this.getProcess();
        },
        methods: {
            handleClick(row) {
                if(row.id !== this.clickRow) {
                    this.clickRow = row.id;
                    this.bodyLoading = true;
                    this.processCreater = row.startedBy.fullName;
                    var request = 0;
                    var that = this;
                    this.axios.get('/api/function/tasks?processId=' + row.id, {
                        headers: {
                            'Authorization': window.localStorage.Token
                        }
                    })
                        .then(function (response) {
                            that.runningTableDate = response.data;
                            if (++request === 2){
                                that.showBody = true;
                                that.bodyLoading = false
                            }
                        })
                        .catch(function (error) {
                            that.error(error.response.data.message);
                            window.localStorage.Token = null;
                            that.$router.replace('/Login');
                        });
                    this.axios.get('/api/function/tasks?processId=' + row.id + '&getType=completed', {
                        headers: {
                            'Authorization': window.localStorage.Token
                        }
                    })
                        .then(function (response) {
                            that.completedTableDate = response.data;
                            if (++request === 2){
                                that.showBody = true;
                                that.bodyLoading = false
                            }
                        })
                        .catch(function (error) {
                            that.error(error.response.data.message);
                            window.localStorage.Token = null;
                            that.$router.replace('/Login');
                        });
                }
            },
            pushClick(row) {
                if(typeof(row) !== "undefined") {
                    this.clickRow = row;
                    this.bodyLoading = true;
//                    this.processCreater = row.startedBy.fullName;
                    var request = 0;
                    var that = this;
                    this.axios.get('/api/function/tasks?processId=' + row, {
                        headers: {
                            'Authorization': window.localStorage.Token
                        }
                    })
                        .then(function (response) {
                            that.runningTableDate = response.data;
                            if (++request === 2){
                                that.showBody = true;
                                that.bodyLoading = false
                            }
                        })
                        .catch(function (error) {
                            that.error(error.response.data.message);
                            window.localStorage.Token = null;
                            that.$router.replace('/Login');
                        });
                    this.axios.get('/api/function/tasks?processId=' + row + '&getType=completed', {
                        headers: {
                            'Authorization': window.localStorage.Token
                        }
                    })
                        .then(function (response) {
                            that.completedTableDate = response.data;
                            if (++request === 2){
                                that.showBody = true;
                                that.bodyLoading = false
                            }
                        })
                        .catch(function (error) {
                            that.error(error.response.data.message);
                            window.localStorage.Token = null;
                            that.$router.replace('/Login');
                        });
                }
            },
            completedHandleClick(row) {
                this.$router.push({path: '/MyTasks', query: {taskId: row.id, type: 'completed'}})
            },
            runningHandleClick(row) {
                this.bodyLoading = true;
                var that = this;
                this.axios.get('/api/function/tasks?taskId=' + row.id, {
                    headers: {
                        'Authorization': window.localStorage.Token,
                    }
                })
                    .then(function (response) {
                        console.info(response.data);
                        if (response.data.initiatorCanCompleteTask){
                            that.$router.push({path: '/MyTasks', query: {taskId: row.id, type: 'open'}})
                        } else if (response.data.assignee === null){
                            if(response.data.involvedPeople){
                                response.data.involvedPeople.forEach((involvedPeople) => {
                                    that.involvedPeople.push({
                                        label: involvedPeople.firstName + " " + involvedPeople.lastName,
                                        key: involvedPeople.id
                                    })
                            });
                        }
                            that.$refs.AssignedTask.show(row.id);
                            that.involvedPeople = [];
                            that.bodyLoading = false;
                        } else {
                            that.open(row.assignee.fullName);
                            that.bodyLoading = false;
                        }
                    })
                    .catch(function (error) {
                        that.error(error.response.data.message);
                        window.localStorage.Token = null;
                        that.$router.replace('/Login');
                    });
            },
            getProcess() {
                this.showBody = false;
                this.taskLoading = true;
                var that = this;
                this.axios.get('/api/function/process?getType=' + this.state, {
                    headers: {
                        'Authorization': window.localStorage.Token
                    }
                })
                    .then(function (response) {
                        that.clickRow = '';
                            if(typeof(that.$route.query.processId) !== "undefined") {
                                that.clickRow = that.$route.query.processId;
                                var change = true;
                                response.data.forEach((process) => {
                                    if (process.id === that.$route.query.processId) {
                                        change = false;
                                    }
                                });
                                if (change) {
                                    that.stateClick();
                                } else {
                                    that.tableDate = response.data;
                                }
                                that.pushClick(that.$route.query.processId);
                            } else {
                                that.tableDate = response.data;
                            }
                        that.taskLoading = false;
                    })
                    .catch(function (error) {
                        that.error(error.response.data.message);
                        window.localStorage.Token = null;
                        that.$router.replace('/Login');
                    });
            },
            stateClick() {
                this.showForm = false;
                if (this.state === 'running'){
                    this.stateShow = '已完成流程';
                    this.state = 'completed';
                    this.getProcess();
                } else {
                    this.stateShow = '未完成流程';
                    this.state = 'running';
                    this.getProcess();
                }
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
            tableRowClassName({row}) {
                if (row.id === this.clickRow) {
                    return 'click-row';
                }
                return '';
            },
            open(name) {
                this.$alert('处理人： ' + name, '当前任务已被接受，正在处理中...', {
                    confirmButtonText: '确定'
                });
            }
        },
        data() {
            return {
                state: 'running',
                stateShow: '未完成流程',
                clickRow: '',
                bodyLoading: false,
                showBody: false,
                tableDate: [],
                runningTableDate: [],
                completedTableDate: [],
                involvedPeople: [],
                taskLoading: true,
                processCreater: ''
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .el-table .click-row {
        background: #DBEDFF;
    }
    .el-table__body tr:hover>td{
        background-color: #DBEDFF!important;
    }
</style>
