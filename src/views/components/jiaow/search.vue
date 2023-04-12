<template>
    <div class="search">
        <span class="search-l">{{ value2 }}</span>
        <div class="search-c">
            <div class="block">
                <div class="demonstration">日期</div>
                    <el-date-picker
                    v-model="value"
                    type="date"
                    :clearable="false"
                    :default-value="new Date()"
                    popper-class="popselect"
                    :popper-append-to-body='false'
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    @change = changeDate()>
                    </el-date-picker>
            </div>
            <div class="film">
                <div class="demonstration">场次</div>
                <el-select v-model="value1" placeholder="请选择" @change = changeCs()>
                    <el-option
                    v-for="item in options"
                    :key="item.value1"
                    :popper-append-to-body="false"
                    :label="item.label"
                    :value="item.value1"
                    :class="value1===item.value1? 'el-icon-check':''">
                    </el-option>
                </el-select>
            </div>
            <div class="subject">
                <div class="demonstration">科目</div>
                <el-select v-model="value2" placeholder="请选择"  @change="changeSelect(value2)" :disabled="value1? false:true">
                    <el-option
                    v-for="item in optionlist"
                    :key="item"
                    :popper-append-to-body='false'
                    :label="item"
                    :value="item"
                    :class="value2===item? 'el-icon-check':''">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="search-r">
            数据更新时间：<span>{{ nowDate }}</span>
        </div>
    </div>
</template>

<script>
import Cookies from "js-cookie";
import EventBus from "../../../utils/eventBus";
export default {
    data() {
        return {
            nowDate: sessionStorage.getItem('LateTime'), //存放年月日变量
            nowTime: null, //存放时分秒变量
            timer: "", //定义一个定时器的变量
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
            },
            options: [{
                value1: '1',
                label: '上午'
                }, {
                value1: '2',
                label: '下午'
                }],
            optionlist: '',
            value: '',
            value1: '',
            value2: '',
        }
    },
    methods: {
        // 获取实时时间
        getTime(){
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hour= date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();
            if(this.hour>12) {
                this.hour -= 12;
            }
                this.month=check(month);
                this.day=check(day);
                this.hour=check(hour);
                this.minute=check(minute);
                this.second=check(second);
                function check(i){
                    const num = (i<10)?("0"+i) : i;
                    return num;
                }
                this.nowDate = year + "-" + this.month + "-" + this.day;
                this.nowTime = this.hour + ":" + this.minute + ":" + this.second
        },
        // 选择时间
        changeDate(){
            this.project()
        }, 
        // 选择场次
        changeCs(){
            this.project()
        },
        // 选择科目
        changeSelect() {
            this.Trip()
        },
        // 日期转换
        formatDate(){  
            let date = new Date()
            var y = date.getFullYear();  
            var m = date.getMonth() + 1;  
            m = m < 10 ? '0' + m : m;  
            var d = date.getDate();  
            d = d < 10 ? ('0' + d) : d;  
            return y + '-' + m + '-' + d;  
        },  
        // 科目数据
        project() {
            let data={
                date: this.value,
                time: this.value1
            }
            this.$http.get("/api/examStatistics/subjects",{params:data}).then((res) =>{
                this.optionlist = res.data
                this.value2 = this.optionlist[0]  //默认选中项
                // this.changeSelect()
                this.Trip()
            })
        },
        // 传值
        Trip(){
            if(this.value && this.value1 && this.value2){
                let obj = {
                    date: this.value,
                    time:  this.value1,
                    subject: this.value2
                }
                EventBus.$emit("Search", obj,this.optionlist);
            }
        }
    },
    created(){
        this.value = this.formatDate()
        this.value1 = this.options[0].value1
        EventBus.$on('LateTimes',data => {
            this.nowDate = data
        })
        this.project()
        // this.timer = setInterval(this.getTime, 1000);
    },
    mounted() {
        document.cookie = Cookies.get("token")
    },  
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer); // 在Vue实例销毁前，清除定时器
        }
    }
}

</script>

<style lang="less" scoped>
    .search {
        width: 100%;
        height: 60px;
        background: #0C2950;
        opacity: 0.8;
        display: flex;
        box-sizing: border-box;
        .search-l {
            width: 20%;
            font-size: 30px;
            line-height: 60px;
            font-family: SourceHanSansCN-Bold;
            font-weight: bold;
            color: #FFFFFF;
            margin-left: 20px;
            background: linear-gradient(180deg, #FFFFFF 25%, #1DB2FF 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .search-c {
            margin: auto;
            display: flex;
            .demonstration {
                display: inline-block;
                width: 60px;
                height: 40px;
                background: url(../../../assets/jiaow/search_l.png)no-repeat;
                background-size: 100% 100%;
                font-family: SourceHanSansCN-Regular;
                text-align: center;
                line-height: 40px;
                font-size: 18px;
                font-weight: 400;
                color: #031F45;
            }
            .block, .film, .subject {
                display: flex;
                margin-left: 40px;
            }
        }
        .search-r {
                width: 20%;
                text-align: right;
                font-size: 18px;
                font-weight: 400;
                color: #3B8AC4;
                margin-right: 20px;
                line-height: 60px;
                font-family: SourceHanSansCN-Regular;
            span {
                font-size: 18px;
                font-weight: 400;
                color: #9DDDFF;
            }
        }
    }
    /deep/ .el-input--medium .el-input__inner {
        height: 40px;
        line-height: 40px;
    }
    /deep/.el-input.is-disabled .el-input__inner {
        background: #031F45;
    }
</style>
