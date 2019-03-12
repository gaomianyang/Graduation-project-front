<template>
    <div>
        <div class="Navigation">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <div class="logo">
                    <router-link to="/Welcome">
                        <a><img src="./img/logo.png" height="80px" width="80"></a>
                    </router-link>
                </div>
                <el-menu-item class="submenu" index="1" style="margin-left: 59%">个人信息</el-menu-item>
                <el-menu-item class="submenu" index="2">我的流程</el-menu-item>
                <el-menu-item class="submenu" index="3">开始流程</el-menu-item>
                <el-menu-item class="submenu" index="4">完结流程</el-menu-item>
            </el-menu>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'LoginHeader',
        props: {
            msg: String
        },
        data() {
            return {
                activeIndex: '1'
            };
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .logo{
        float: left;
    }
    .Navigation{
        float: left;
        width: 60%;
        margin-left: 20%;
    }
    .submenu{
        margin-top: 24px;
    }
</style>