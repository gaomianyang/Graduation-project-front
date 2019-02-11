<template>
    <div>
        <br/><br/><br/><br/>
        <el-carousel :interval="4000" type="card" height="500px">
            <el-carousel-item v-for="(img,index) in imgList" :key="index">
                <img v-bind:src="img.url">
            </el-carousel-item>
        </el-carousel>
        <br/><br/><br/><br/><br/>
        <div style="text-align: center">
            <el-row>
                <router-link to="/Login">
                    <el-button size="medium" round>Click and login to try the wonderful experience  →</el-button>
                </router-link>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Welcome',
        props: {
            msg: String
        },
        data(){
            return{
                imgList:[
                    {url:require('./img/1.jpg')},
                    {url:require('./img/2.jpg')},
                    {url:require('./img/3.jpg')},
                    {url:require('./img/4.jpg')},
                    {url:require('./img/5.jpg')},
                    {url:require('./img/6.jpg')}
                ]
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
