<template>
 <div id="history">
    <div id="history-container"></div>
  </div>
</template>

<script>
let axios = require("axios");
let jq = require("jquery");
let echarts = require("echarts");
const d3 = require("d3-dsv");
export default {
  name: "poeHistory",
  mounted: function() {
    var year=[];
    var data=[];
    var event=[];
    var yMax = 25;
    var dataShadow = [];
    let res = axios.get("/api/bgEvent.json").then(res => {
      for(var i=0;i<res.data.length;i++)
      {
      for(var key in res.data[i])
      {
        year.push(key)
        data.push(res.data[i][key]["num"])
        event.push(res.data[i]);
      }

      }
    for (var i = 0; i < data.length; i++) {
      dataShadow.push(yMax);
    }
      this.drawhistory(year,data,dataShadow,event)
      console.log(event)
    });
  },

  methods: {
    drawhistory(dataAxis,data,dataShadow,event) {
      let chart = echarts.init(document.getElementById("history-container"));

      var option = {
        title: {
          text: "时政背景与相关作品",
          //subtext: "Feature Sample: Gradient Color, Shadow, Click Zoom"
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            inside: true,
            textStyle: {
              color: "#fff"
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          {
            // For shadow
            type: "bar",
            itemStyle: {
              color: "rgba(0,0,0,0.05)"
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            data: dataShadow,
            animation: false
          },
          {
            type: "bar",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            },
            data: data
          }
        ]
      };
      chart.setOption(option);
      // Enable data zoom when user click bar.
      var zoomSize = 6;
      chart.on("click", function(params) {
        chart.dispatchAction({
          type: "dataZoom",
          startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
          endValue:
            dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
        });

        //弹出提示框信息
        for(var i=0;i<event.length;i++)
        {
          
          for(var key in event[i])
        {
          //console.log(key==params.name)
          if(key==params.name)
          {
            let str="时政："+event[i][key]["event"]+"\n"+"事件："+event[i][key]["libai"]+"\n"+"相关诗作："+event[i][key]["poem"]
            confirm(str)
          }
        }
        }
      });
    }
  }
};
</script>

<style>
#history {
  width: 40%;
  height: 40%;
  margin-bottom: 2%;
  float: right;
  position: relative;
  color: #6f60aa;
}
#history-container {
  width: 100%;
  height: 100%;
}
</style>
