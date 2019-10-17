<template>
  <div id="clouds">

  </div>
</template>

<script>
  let axios = require('axios')

  let echarts = require('echarts');
  let eclouds = require('echarts-wordcloud')


  export default {

    name: 'clouds',

    mounted:function(){

      let res = axios.get('/api/Emotion.json').then(res => {
        console.log(res.data)
        this.drawWords(res.data)
      })

    },

    methods:{

      drawWords(data){

        var myChart = echarts.init(document.getElementById('clouds'))

        var option = {
          title: {
            text: '词云',//标题
            x: 'center',
            textStyle: {
              fontSize: 23
            }

          },
          backgroundColor: '#F7F7F7',
          tooltip: {
            show: true
          },
          series: [{
            name: '热点分析',//数据提示窗标题
            type: 'wordCloud',
            sizeRange: [16,70],//画布范围，如果设置太大会出现少词（溢出屏幕）
            rotationRange: [-45, 90],//数据翻转范围
            shape: 'rect',
            textPadding: 0,
            autoSize: {
              enable: true,
              minSize: 6
            },
            textStyle: {
              normal: {
                color: function() {
                  return 'rgb(' + [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                  ].join(',') + ')';
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            data:data
            //name和value建议用小写，大写有时会出现兼容问题
          }]
        };
        // 绘制图表
        myChart.setOption(option);
      }
    }

  }
</script>

<style>
  #clouds{
    width: 100%;
    height: 35%;
    border: 1px solid #aaa;
    background: burlywood;

  }
</style>
