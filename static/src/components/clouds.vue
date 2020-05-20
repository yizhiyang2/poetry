<template>
<div id="clouds-content">
	<div id="clouds">
	
  </div>
</div>
  
</template>

<script>

  import { mapGetters} from 'vuex'
  import pubsub from 'pubsub-js'
  let axios = require('axios')
  let jq = require('jquery')
  let echarts = require('echarts');
  let eclouds = require('echarts-wordcloud')

  export default {

    name: 'clouds',

    mounted:function(){

      let res = axios.get('/api/Emotion.json').then(res => {
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
          backgroundColor: 'burlywood',
          tooltip: {
            show: true
          },
          series: [{
            name: '热点分析',//数据提示窗标题
            type: 'wordCloud',
            sizeRange: [10,120],//画布范围，如果设置太大会出现少词（溢出屏幕）
            rotationRange: [-45, 90],//数据翻转范围
            shape: 'rect',
            clickable : true,
            // background:'#DEB887',
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
        myChart.on('click',function(params){
          var pub_cloudType=params.data.name;
            console.log(params.data.name);
            pubsub.publish('pub_cloudType',pub_cloudType);
        });
        // 绘制图表
        myChart.setOption(option);
      }
    },
 

  }
</script>

<style>
  #clouds-content{
   width: 50%;
   height: 90%;
   float: left;
   margin-top: 2%;
  }
  #clouds{
	  width: 100%;
	  height: 100%;
	  border: 3px solid lightslategrey;
  }
</style>
