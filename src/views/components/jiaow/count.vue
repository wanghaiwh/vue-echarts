<template>
    <div class="total" v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.9)">
       <div class="total_l">
            <div class="kszs Mobile">
                    <div class="animate-border">
                    <i></i>
                    <i></i>
                    <div>
                        <div class="kszs_tit">考生总数</div>
                        <div class="kszs_cont">
                            <span>
                                <countTo :startVal='0' :endVal='Examination.entrantCount? Examination.entrantCount:0' :duration='1500' separator></countTo> 人
                            </span>
                        </div>
                    </div>
                    </div>
            </div>
            <div class="sbqdks Mobile">
                    <div class="animate-border">
                    <i></i>
                    <i></i>
                        <div>
                            <div class="kszs_tit sbqdks_tit">哨兵签到考生</div>
                            <div class="kszs_cont">
                                <span>
                                    <countTo :startVal='0' :endVal='Examination.entrantCheckCount? Examination.entrantCheckCount:0' :duration='1500' separator></countTo> 人
                                </span>
                            </div>
                        </div>
                    </div>
            </div>
            <div class="err Mobile">
                    <div class="animate-border">
                    <i></i>
                    <i></i>
                    <div>
                        <div class="kszs_tit err_tit">异常</div>
                        <div class="kszs_cont">
                            <span>
                                <countTo :startVal='0' :endVal='Examination.entrantErrorCount? Examination.entrantErrorCount:0' :duration='1500' separator></countTo> 人
                            </span>
                        </div>
                    </div>
                    </div>
            </div>
       </div>
       <div class="total_r Mobile">
        <div class="animate-border">
                    <i></i>
                    <i></i>
                <div class="kdtj_header">
                    <div class="kdtj_header_l">
                        <div class="kdtj">考点统计</div>
                        <ul class="lengend">
                            <li>异常人数</li>
                            <li>考生总数</li>
                            <li>签到考生数</li>
                            <li>回传市教委考生数</li>
                        </ul>
                    </div>
                </div>
            <div id="MyChart" style="width: 100%;height:100%;"></div>
       </div>
       </div>
    </div>
</template>

<script>
import countTo from 'vue-count-to';
import EventBus from "../../../utils/eventBus";
export default {
    components: { countTo },
    name: '',
    data() {
        return {
            indoorParams:1,
            loading: false,
            Examination: '',
            xAxisDate:[],    // x轴坐标数据
            kszs:[],         // 考生总数
            qdksList: [],    // 签到考生总数
            ErrorList: [],   // 异常总数
            Hcsjw: [],        // 回传市教委总数
            dgList:''
        }
    },
    created() {
        EventBus.$on('Search',(data,val) => {
            console.log('val',val);
            this.dgList = data
            // data.date = '2023-01-07',
            // data.time = '1',
            // data.subject = '外语笔试' 
            this.ExamStatistics(data)
        })

    },  
    mounted() {
    },
    methods: {
        // 页面数据
        ExamStatistics(data){
            // this.loading = true
            this.xAxisDate = []
            this.kszs =[]
            this.qdksList =[]
            this.ErrorList =[]
            this.Hcsjw = []
            sessionStorage.setItem('LateTime','')
            this.$http.get("/api/examStatistics",{params:data}).then((res) =>{
                if(res.status=== 200) {
                    this.Examination = res.data
                    this.loading = false
                    this.Examination.schoolExamStatistics.forEach(item =>{
                        this.xAxisDate.push(item.schoolName)
                        this.kszs.push(item.entrantCount)
                        this.qdksList.push(item.entrantCheckCount)
                        this.ErrorList.push(item.entrantErrorCount)
                        this.Hcsjw.push(item.entrantPostBackCount)
                    })
                    this.$nextTick(() =>{
                        this.MychartFn()
                    })
                    sessionStorage.setItem('LateTime',this.Examination.updateTime)
                    // 传值
                    EventBus.$emit("LateTimes", this.Examination.updateTime);
                    // 递归请求2分钟一次
                    setTimeout(() => {
                        this.dgList
                        this.ExamStatistics(this.dgList)
                    }, 120000);
                }
            })
        },
        // 图表
        MychartFn(){
            var app = {};
            var chartDom = document.getElementById('MyChart');
            var myChart = this.$echarts.init(chartDom);
            window.onresize = myChart.resize
            var option ={};
            app.configParameters = {
            rotate: {
                min: -90,
                max: 90
            },
            align: {
                options: {
                    left: 'left',
                    center: 'center',
                    right: 'right'
                }
            },
            verticalAlign: {
                options: {
                    top: 'top',
                    middle: 'middle',
                    bottom: 'bottom'
                }
            },
            distance: {
                min: 0,
                max: 100
            }
            };
            app.config = {
                rotate: 90,
                align: 'left',
                verticalAlign: 'middle',
                position: 'insideBottom',
                distance: 15,
            onChange: function () {
                const labelOption = {
                rotate: app.config.rotate,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                position: app.config.position,
                distance: app.config.distance
                };
                myChart.setOption({
                series: [
                    {
                    label: labelOption
                    },
                    {
                    label: labelOption
                    },
                    {
                    label: labelOption
                    },
                    {
                    label: labelOption
                    }
                ]
                });
            }
            };
            option = {
                grid:{ // 让图表占满容器
                    top:"50px",
                    left:"70px",
                    right:"50px",
                    bottom:"190px",
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        // label:{
                        //     show:true,
                        //     textAlign: 'center',
                        //     axisLabel: {  
                        //         interval:0,
                        //         margin: 10,
                        //         rotate: 45,  //倾斜的程度
                        //         // backgroundColor: '#0A3055',
                        //         opacity: 0.6,
                        //         padding: [15, 15],
                        //     },
                        //     textStyle: {
                        //         // 数值样式
                        //         color: '#37B2F7',
                        //         fontSize: 12,
                        //         borderWidth: 0,
                        //         padding: [15, 15],
                        //         backgroundColor: '#0A3055',
                        //     }
                        // },
                        shadowStyle: {
                            color: '#0A3055',
                            opacity: 0.6,
                        },
                        z: 0,  //注意要设置层级，不然会在覆盖在柱子前面，设置为0就在柱子后面显示了
                    },
                    formatter:function (value) {
                        return `
                                ${value[0].axisValue}<br />
                                异常人数: ${value[3]? value[3].value:0}         <br />
                                考生总数: ${value[0].value}         <br />
                                签到考生数：${value[1].value}       <br />
                                回传市教委考生数: ${value[2].value} <br />
                        `
                    }
                },
                xAxis: [
                    {
                    type: 'category',
                    axisTick: { show: false },
                    axisLine: {
                        show:false,
                        lineStyle: {
                             color: "#B4BECD;", //最左侧Y轴颜色
                        }
                    },
                    axisLabel: {  
                        interval:0,
                        margin: 10,
                        rotate: 45,  //倾斜的程度
                        // backgroundColor: '#0A3055',
                        opacity: 0.6,
                        padding: [15, 15],
                        formatter: function (value) {
                                return `${value}`;
                        },
                    },
                    data: this.xAxisDate
                    }
                ],
                yAxis: [
                    {   
                    min: this.Examination.entrantCheckCount==1? -1:-100,  //取-50为最小刻度
                    scale: true, //自适应
                    minInterval: 1, //分割刻度
                    splitNumber : 5,
                    boundaryGap : [ 0.2, 0.2 ],
                    axisLabel: {  
                        interval:0,
                        margin: 25,
                        formatter: function (value) {
                            let texts = [];
                            texts.push(value);
                            //获取Y轴的刻度范围
                            let rangeY = myChart.getModel().getComponent('yAxis').axis.scale._extent;
                            if (texts[0] === rangeY[1] ) {
                                texts[0] = '人数'
                            }
                            if (texts[0] < 0) {
                                texts[0] = ''
                            }
                                return texts;
                        }
                    },
                    // 单独隐藏坐标线
                    axisLine: {
                        show:false,
                        lineStyle: {
                             color: "#ADB7C6", //最左侧Y轴颜色
                        }
                    },
                    // 单独隐藏刻度线
                    axisTick: {
                        show: false
                    },
                    splitLine: { //多条横线
                        show: true,
                        lineStyle: {
                             color: "#14325B", //最左侧Y轴颜色
                        }
                    },
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '考生总数',
                        type: 'bar',
                        barWidth: 10,
                        barGap:'30%',/*多个并排柱子设置柱子之间的间距*/
                        barCategoryGap:'50%',/*多个并排柱子设置柱子之间的间距*/
                        label: {
                            show: false,
                            position: [-8, -25],
                            textAlign: 'center',
                            textStyle: {
                            // 数值样式
                            color: '#1DB2FF',
                            fontSize: 12,
                            borderWidth: 1,
                            padding: [3, 3],
                            borderColor: '#1DB2FF',
                        }
                        },
                        itemStyle: {
                            color: new this.$echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {
                                        offset: 0,
                                        color: '#1CA9EF'
                                    },
                                    {
                                        offset: 0.7,
                                        color: '#0E496E'
                                    },
                                    {
                                        offset: 1,
                                        color: '#082347'
                                    }
                                ]
                            )
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: this.kszs
                    },
                    {
                        name: '签到考生数',
                        barWidth: 10,
                        type: 'bar',
                        label: {
                            show: false,
                            position: [-8, -25],
                            textAlign: 'center',
                            textStyle: {
                            // 数值样式
                            color: ' #06DC98',
                            fontSize: 12,
                            borderWidth: 1,
                            padding: [3,3],
                            borderColor: '#06DC98',
                        }
                        },
                        itemStyle: {
                            color: new this.$echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [{
                                        offset: 0,
                                        color: '#06DC98'
                                    },
                                    {
                                        offset: 1,
                                        color: '#082749'
                                    },
                                ]
                            )
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: this.qdksList
                    },
                    {
                        name: '回传市教委考生数',
                        barWidth: 10,
                        type: 'bar',
                        label: {
                            show: false,
                            position: [-5, -25],
                            textAlign: 'center',
                            textStyle: {
                            // 数值样式
                            color: '#F3B560',
                            fontSize: 12,
                            borderWidth: 1,
                            padding: [3,3],
                            borderColor: '#F3B560',
                            height: 20,
                            lineHeight: 0,
                        }
                        },
                        itemStyle: {
                            color: new this.$echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [{
                                        offset: 0,
                                        color: '#F3B560'
                                    },
                                    {
                                        offset: 1,
                                        color: '#1A2959'
                                    }
                                ]
                            )
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: this.Hcsjw
                    },
                    {
                        name: '异常人数',
                        barWidth: 0,
                        type: 'bar',
                        barMinHeight:50,
                        label: {
                            show: true,
                            position: 'bottom',
                            textAlign: 'center',
                            textStyle: {
                                // 数值样式
                                color: '#FF7660',
                                fontSize: 16,
                                borderWidth: 0.5,
                                padding: [10,10],
                                borderColor: '#FF7660',
                                borderRadius: 50,
                                shadowBlur: 50, // 图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果
                                shadowOffsetX: 1, // 阴影水平方向上的偏移距离
                                shadowOffsetY: 1,
                                textAlign:'center',
                                shadowColor: '#FF7660', // 阴影颜色
                            },
                            formatter: function(value) {
                                return Math.abs(value.data)
                            }
                        },
                        itemStyle: {
                            color: 'transparent',
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        markArea: { //标记区域
							data: [
								[{
									yAxis: '-500',
									itemStyle: {
										color: '#14325B',
                                        opacity:0.6
									}
								}, {
									yAxis: '0'
								}],
							]
						},
                        data: this.ErrorList
                    },
                ]
            };
            option && myChart.setOption(option);
        },
    }
}
</script>

<style lang="less" scoped>
    .total {
        padding-top: 20px;
        width: 100%;
        min-height: 786px;
        box-sizing: border-box;
        display: flex;
        .total_l {
            box-sizing: border-box;
            .kszs,.sbqdks,.err {
                width: 212px;
                height: 31.7%;
                background: url(../../../assets/jiaow/border_l.png)no-repeat;
                background-size: 100% 100%;
                font-size: 18px;
                font-family: SourceHanSansCN-Regular;
                font-weight: 400;
                color: #9DDDFF;
                line-height: 18px;
            }
            .sbqdks,.err {
                margin-top: 20px;
            }
            .kszs_tit{
                margin-left: 30px;
                line-height: 100px;
            }
            .kszs_tit::before {
                content: '';
                display: inline-block;
                position: relative;
                top: 5px;
                left: -10px;
                width: 25px;
                height: 25px;
                background-color: #fff;
                background: url(../../../assets/jiaow/kszs.png)no-repeat;
                background-size: 100%;
            }
            .sbqdks_tit::before{
                background: url(../../../assets/jiaow/sbqdks.png)no-repeat;
                background-size: 100%;
            } 
            .err_tit::before{
                background: url(../../../assets/jiaow/err.png)no-repeat;
                background-size: 100%;
            }
            .kszs_cont{
                width: 198px;
                height: 94px;
                line-height: 94px;
                text-align: center;
                background: url(../../../assets/jiaow/jux.png)no-repeat;
                background-size: 100%;
                span {
                    font-size: 30px;
                    font-family: SourceHanSansCN-Medium;
                    font-weight: 500;
                    color: #FFFFFF;
                    display: inline-block;
                    margin: auto;
                    background: linear-gradient(180deg, #FFFFFF 10%, #1DB2FF 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
        }
        .total_r{
            width: 100%;
            height: auto;
            margin-left: 20px;
            background: url(../../../assets/jiaow/border_r.png)no-repeat;
            background-size: 100% 100%;
            position: relative;
            overflow: hidden;
            .kdtj_header {
                height: 50px;
                padding: 10px 20px 10px 20px;
                box-sizing: border-box;
                margin: 1px;
                background: rgba(8,79,140,0.7);
                .kdtj_header_l {
                    font-size: 20px;
                    line-height: 30px;
                    opacity: 0.7;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    font-family: SourceHanSansCN-Regular;
                    font-weight: 400;
                    color: #9DDDFF;
                    line-height: 18px;
                    .kdtj {
                        margin-left: 10px;
                    }
                    .kdtj::before {
                        content: '';
                        display: inline-block;
                        width: 4px;
                        height: 22px;
                        background: #9DDDFF;
                        border-radius: 2px;
                        position: relative;
                        top: 4px;
                        left: -10px;
                    }
                    ul{
                        display: flex;
                        line-height: 30px;
                        li{
                            margin-right: 50px;
                            list-style:none;
                            font-size: 16px;
                            font-family: SourceHanSansCN-Regular;
                            font-weight: 400;
                            color: #9DDDFF;
                            &::before {
                                content: '';
                                display: inline-block;
                                position: relative;
                                top: -1px;
                                left: -10px;
                                width: 10px;
                                height: 10px;
                                background: #01BBEF;
                            }
                            &:last-child {
                                margin-right: 0;
                            }
                            &:nth-child(1)::before {
                                border-radius: 50%;
                                background: #FF7660;
                            }
                            &:nth-child(2)::before {
                                background: #01BBEF;
                            }
                            &:nth-child(3)::before {
                                background: #28C090;
                            }
                            &:nth-child(4)::before {
                                background: #F3B560;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
