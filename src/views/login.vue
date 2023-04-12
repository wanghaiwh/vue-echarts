<template>
    <div class="login">
        <Header></Header>
        <div class="login_center">
            <div class="tit">系统登录</div>
            <div class="cont">
               <span class="user"></span> 
               <input type="text" v-model="userName" placeholder="请输入您的用户名"><br/>
               <div class="lines" style="margin-bottom: 30px;"></div>
               <span class="password"></span>
               <input type="password" v-model="password" placeholder="请输入您的密码">
               <div class="lines"></div>
            </div>
            <div class="submit" @click="Submit">登录</div>
        </div>
    </div>
</template>
<script>
import Header from './components/jiaow/header'
import { encrypt } from '@/utils/jsencrypt'
import Cookies from "js-cookie";
export default {
    components:{
        Header
    },
    data() {
        return {
            userName:'',
            password: ''
        }
    },
    mounted() {
    },
    methods: {
        Submit() {
            if(this.userName && this.password){
                let data = {
                    userName: this.userName,
                    password: this.encrypt(this.password)
                }
                this.$http.post("/api/login",data).then((res) =>{
                    if(res.data.code === 200) {
                        //将后端传递的token存到浏览器的cookie中,过期时间2天
                        Cookies.set("token", res.data.token, { expires: 2 });
                        //登录成功后，跳转到首页页面
                        this.$router.push('/home')
                    }else {
                        console.log('错误-->',res);
                        this.$message({
                            type: "error",
                            message: res.data.msg
                        });
                    }
                })
            } else {
                this.$message({
                    type: "error",
                    message: '请输入用户名或密码'
                });
            }
        },
        // 敏感信息加密
        encrypt(val) {
            return encrypt(val)
        }
    },
}
</script>

<style lang="less" scoped>
        .login{
            width: 100%;
            min-height: 1080px;
            background: url(.././assets/jiaow/login_bg.png)no-repeat;
            background-size: 100% 100%;
            position: relative;
            .login_center {
                width: 693px;
                height: 513px;
                background-color: #fff;
                position: absolute;
                top: calc(50% - 257px);
                left:calc(50% - 347px);
                background: url(.././assets/jiaow/login_border.png)no-repeat;
                background-size: 100% 100%;
                .tit {
                    text-align: center;
                    font-size: 22px;
                    font-family: Source Han Sans CN;
                    font-weight: 500;
                    color: #24DCF7;
                    line-height: 60px;
                }
                .cont {
                    margin: 80px auto;
                    text-align: center;
                    input {
                        height: 60px;
                        background-color: transparent;
                        border-color: transparent;
                        font-size: 18px;
                        font-family: Source Han Sans CN;
                        font-weight: 400;
                        color: #3B8AC4;
                        border: none;
                        margin-left: 30px;
                        &::-webkit-input-placeholder { /* WebKit browsers */
                            font-size: 18px;
                            font-family: Source Han Sans CN;
                            font-weight: 400;
                            color: #3B8AC4;
                        }
                        &:focus{
                            outline: none;
                        }
                    }
                    .lines {
                        width: 540px;
                        height: 1px;
                        text-align: center;
                        margin:auto;
                        background: linear-gradient(90deg, #1DB2FF 0%, rgba(29,178,255,0) 95%);
                    }
                }
                .user,.password {
                    display: inline-block;
                    position: relative;
                    top:3px;
                    width: 27px;
                    height: 25px;
                    background: url(.././assets/jiaow/login_user.png)no-repeat;
                }
                .password {
                    background: url(.././assets/jiaow/login_password.png)no-repeat;
                }
                .submit {
                    width: 273px;
                    height: 60px;
                    text-align: center;
                    margin: auto;
                    line-height: 60px;
                    font-size: 24px;
                    font-family: Source Han Sans CN;
                    font-weight: 500;
                    color: #031F45;
                    cursor: pointer;
                    background: url(.././assets/jiaow/login_submit.png)no-repeat;
                }
            }
        }
</style>
