<template>
    <div>
        <Header msg="3"></Header>
        <div class="body">
            <div style="float: left">
                <el-table
                        v-loading="loading"
                        :data="tableDate"
                        height="820px"
                        border
                        style="width: 251px"
                        :row-class-name="tableRowClassName"
                        @row-click="handleClick">
                    <el-table-column
                            id="id"
                            prop="name"
                            width="250">
                        <template slot="header" slot-scope="scope">
                            <span>我的任务</span>
                            <el-button size="small" type="text" @click="stateClick" style="float: right; margin-right: 10px;">{{stateShow}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-loading="formLoding" style="float: left; width: 600px; margin-left: 10%; margin-top: 50px">
                <el-form v-if="showForm" ref="numberValidateForm" class="demo-ruleForm">
                    <el-form-item>
                        <span style="float: left">任务创建时间: {{ this.created }}</span>
                        <el-button style="float: right" v-if="state !== 'completed'" type="primary" icon="el-icon-d-arrow-right" plain @click="">查看该流程</el-button>
                    </el-form-item>
                    <el-form-item v-for="(inputMessage, index) in this.taskForm">
                        <el-input
                                :disabled="state === 'completed'"
                                v-if="inputMessage.type==='text'"
                                v-model="inputMessage.value"
                                :placeholder="inputMessage.name">
                        </el-input>
                        <el-select
                                :disabled="state === 'completed'"
                                style="width: 600px"
                                v-else-if="inputMessage.type==='dropdown'"
                                v-model="inputMessage.value"
                                :placeholder="inputMessage.name">
                            <el-option
                                    :disabled="state === 'completed'"
                                    v-for="item in inputMessage.options"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <el-radio
                                :disabled="state === 'completed'"
                                v-else-if="inputMessage.type==='radio-buttons'"
                                v-for="item in inputMessage.options"
                                v-model="inputMessage.value"
                                :label="item.name">{{ item.name }}
                        </el-radio>
                        <el-input
                                :disabled="state === 'completed'"
                                v-else-if="inputMessage.type==='multi-line-text'"
                                type="textarea"
                                autosize
                                :placeholder="inputMessage.name"
                                v-model="inputMessage.value">
                        </el-input>
                        <el-input v-else :placeholder="inputMessage.type"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="state !== 'completed'" type="primary" plain round @click="completeTask">completed</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from './LoginHeader.vue'
    export default {
        components: {
            Header
        },
        name: 'MyTasks',
        created() {
            this.getTasks();
        },
        methods: {
            formInit() {
                this.taskForm = [];
                this.formValueMap = {};
                this.showForm = false;
            },
            tableRowClassName({row}) {
                if (row.id === this.clickRow) {
                    return 'click-row';
                }
                return '';
            },
            handleClick(row) {
                if(row.id !== this.clickRow) {
                    this.clickRow = row.id;
                    this.formLoding = true;
                    var that = this;
                    this.axios.get('/api/function/form?taskId=' + row.id, {
                        headers: {
                            'Authorization': window.localStorage.Token,
                        }
                    })
                        .then(function (response) {
                            that.formInit();
                            that.changeCreated(row.created);
                            that.taskForm = response.data;
                            that.formLoding = false;
                            that.showForm = true;
                        })
                        .catch(function (error) {
                            that.error(error.response.data.message);
                            window.localStorage.Token = null;
                            that.$router.replace('/Login')
                        });
                }
            },
            stateClick() {
                this.showForm = false;
                if (this.state === 'open'){
                    this.stateShow = '已完成任务';
                    this.state = 'completed'
                    this.getTasks();
                } else {
                    this.stateShow = '未完成任务';
                    this.state = 'open'
                    this.getTasks();
                }
            },
            getTasks() {
                var that = this;
                that.loading = true;
                this.axios.get('/api/function/tasks?getType=' + this.state, {
                    headers: {
                        'Authorization': window.localStorage.Token,
                    }
                })
                    .then(function (response) {
                        that.formInit();
                        that.clickRow = '';
                        that.tableDate = response.data;
                        that.loading = false;
                    })
                    .catch(function (error) {
                        that.error(error.response.data.message);
                        window.localStorage.Token = null;
                        that.$router.replace('/Login')
                    });
            },
            completeTask() {
                var that = this;
                this.formLoding = true;
                for(var i = 0; i < that.taskForm.length; i++){
//                    eval("that.formValueMap." + that.taskForm[i].id + "=" + that.formValue[i]);
                    that.formValueMap[that.taskForm[i].id] = that.taskForm[i].value;
                }
                console.info(this.clickRow);
                this.axios.put('/api/function/tasks?taskId='+this.clickRow, {
                    values: this.formValueMap,
                    formId: this.taskForm[0].formId
                }, {
                    headers: {
                        'Authorization': window.localStorage.Token
                    }
                })
                    .then(function (response) {
                        that.getTasks();
                        that.formLoding = false;
                        that.success("提交成功！");
                    })
                    .catch(function (error) {
                        that.error(error.response.data.message);
                        window.localStorage.Token = null;
                        that.$router.replace('/Login')
                    });
            },
            changeCreated(created){
                var createdArr = created.split(".");
                created = createdArr[0];
                createdArr = created.split("T");
                created = createdArr[0];
                createdArr = createdArr[1].split(":");
                var h = parseInt(createdArr[0]);
                h = h+8%24;
                this.created = created + "  " + h.toString() + ":" + createdArr[1] + ":" + createdArr[2];
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
            }
        },
        data() {
            return {
                state: 'open',
                stateShow: '未完成任务',
                tableDate: [],
                clickRow: '',
                taskForm: [],
                loading: true,
                formLoding: false,
                formValueMap: {},
                showForm: false,
                created: ''
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
