<template>
    <div>
        <Header msg="4"></Header>
        <div class="body">
            <div style="float: left">
                <el-table
                        v-loading="loading"
                        :data="processDate"
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
                            <span>我的流程</span>
                            <el-button size="small" type="text" @click="stateClick" style="float: right; margin-right: 10px">{{stateShow}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-loading="bodyLoding" style="float: left; width: 600px; margin-left: 10%; margin-top: 50px">

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
        name: 'MyProcess',
        created() {
        },
        methods: {
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
                        })
                        .catch(function (error) {
                        });
                }
            },
            stateClick() {
                this.showForm = false;
                if (this.state === 'open'){
                    this.stateShow = '已完成任务';
                    this.state = 'completed'
                } else {
                    this.stateShow = '未完成任务';
                    this.state = 'open'
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
            }
        },
        data() {
            return {
                state: 'open',
                stateShow: '未完成任务',
                clickRow: '',
                loading: true,
                bodyLoding: false,
                showForm: false,
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
