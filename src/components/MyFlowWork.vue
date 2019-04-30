<template>
    <div v-loading="createLoading">
        <Header msg="2"></Header>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <div class="body" v-loading="loading">
            <el-input style="width: 90%; float: left" v-model="query" placeholder="根据流程名称进行搜索"></el-input>
            <el-color-picker style="margin-left: 6%" v-model="color"></el-color-picker>
            <br/>
            <el-row>
                <el-col :span="4" v-for="(processModel, index) in queryDate(this.processModels)"
                        :key="processModel.key"
                        :offset="index%5 === 0 ? 0 : 1">
                    <div style="transition: 0.5s" :id="processModel.key + div">
                        <div @mouseenter="mouseTouch(processModel.key, index)"
                             @mouseleave="mouseTouch(processModel.key, index)"
                             @click="clickModel(processModel.procdefId, processModel.name)">
                            <el-card :id="processModel.key"
                                     style="margin-top: 30px; height: 70px; cursor: pointer"
                                     :style="{'background':color}"
                                     shadow="hover">
                                <span style="color:#FFF">{{ processModel.name }}</span><br/>
                                <br/><br/>
                                <span :id="processModel.key + description" style="color:#FFF; float: left; display: none">{{ processModel.description }}</span>
                            </el-card>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import Header from './LoginHeader.vue'
    export default {
        components: {
            Header
        },
        created() {
            this.getProcessModel();
        },
        name: 'MyFlowWork',
        methods: {
            clickModel(procdefId, name) {
                var that = this;
                this.$confirm('此操作将创建一个新流程, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.createProcess(procdefId, name);
                }).catch(() => {
                });
            },
            queryDate(list) {
                if (this.query === '') {
                    return list
                }
                return list.filter((item)=>{
                    if(item.name.indexOf(this.query) !== -1){
                        return item;
                    }
                })
            },
            createProcess(procdefId, name){
                this.createLoading = true;
                var that = this;
                this.axios.post('/api/function/process',
                    {
                        procdefId: procdefId,
                        name: name
                }, {
                    headers: {
                        'Authorization': window.localStorage.Token
                    }
                })
                    .then(function (response) {
                        that.success("流程开始成功");
                        that.createLoading = false;
                    })
                    .catch(function (error) {
                        that.error(error.response.data.message);
                        window.localStorage.Token = null;
                        that.$router.replace('/Login');
                    });
            },
            mouseTouch(id, index) {
                index -= index%5;
                var dom = document.getElementById(id);
                var descptionDom = document.getElementById(id + this.description);
                if(index < this.queryDate(this.processModels).length - 5){
                    var nextDomDiv0 = document.getElementById(this.queryDate(this.processModels)[index].key + this.div);
                    var nextDomDiv1 = document.getElementById(this.queryDate(this.processModels)[index + 1].key + this.div);
                    var nextDomDiv2 = document.getElementById(this.queryDate(this.processModels)[index + 2].key + this.div);
                    var nextDomDiv3 = document.getElementById(this.queryDate(this.processModels)[index + 3].key + this.div);
                    var nextDomDiv4 = document.getElementById(this.queryDate(this.processModels)[index + 4].key + this.div);
                    if(nextDomDiv0.style.height === "160px"){
                        nextDomDiv0.style.height = "70px";
                        nextDomDiv1.style.height = "70px";
                        nextDomDiv2.style.height = "70px";
                        nextDomDiv3.style.height = "70px";
                        nextDomDiv4.style.height = "70px";
                    } else {
                        nextDomDiv0.style.height = "160px";
                        nextDomDiv1.style.height = "160px";
                        nextDomDiv2.style.height = "160px";
                        nextDomDiv3.style.height = "160px";
                        nextDomDiv4.style.height = "160px";
                    }
                }
                if(dom.style.height === "160px")
                {
                    dom.style.height = "70px";
                    descptionDom.style.display = "none";
                }
                else{
                    dom.style.height = "160px";
                    descptionDom.style.display = "";
                }
            },
            getProcessModel() {
                var that = this;
                this.axios.get('/api/function/processModelList', {
                    headers: {
                        'Authorization': window.localStorage.Token,
                    }
                })
                    .then(function (response) {
                        that.processModels = response.data;
                        that.loading = false;
                    })
                    .catch(function (error) {
                        that.error(error.response.data.message);
                        window.localStorage.Token = null
                        that.$router.replace('/Login')
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
            }
        },
        data() {
            return {
                processModels: [],
                color: '#409EFF',
                div: 'sdjkfghjvgfs',
                description: 'sdfgujiogbdf',
                query: '',
                loading: true,
                createLoading: false
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>