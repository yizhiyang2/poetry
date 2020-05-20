<template>
 <div id="history">
    <div id="history-container"></div>
  </div>
</template>

<script>
let axios = require("axios");
let jq = require("jquery");
let echarts = require("echarts");
import pubsub from "pubsub-js";
export default {
  name: "poeHistory",
  mounted: function() {
    var year=[];
    var data=[];
    var event=[];
    var yMax = 25;
    var dataShadow = [];
    var poem=[];
    var test=[];
    let res = axios.get("/api/bgEvent.json").then(res => {
      for(var i=0;i<res.data.length;i++)
      {
				for(var key in res.data[i])
				{
					year.push(key)
					data.push(res.data[i][key]["num"])
					event.push(res.data[i]);
						for(var j=0;j<res.data[i][key]["poem"].length;j++)
						{
							test.push(res.data[i][key]["poem"][j])
						}
					//console.log(res.data[i][key]["poem"])
					poem.push(test)
					test=[];
				}

      }
     console.log(poem);
    for (var i = 0; i < data.length; i++) {
      dataShadow.push(yMax);
    }
      this.drawhistory(year,data,dataShadow,event,poem)
     // console.log(event)
    });
  },

  methods: {
    drawhistory(dataAxis,data,dataShadow,event,poem) {
      let chart = echarts.init(document.getElementById("history-container"));

      var option = {
        title: {
          text: "时政背景与相关作品",
		  x:50,
		  y:20
          //subtext: "Feature Sample: Gradient Color, Shadow, Click Zoom"
        },
        xAxis: {
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
        yAxis: {
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
                { offset: 0, color: "#B89715" },
                { offset: 0.5, color: "#6D8844" },
                { offset: 1, color: "#6E7459" }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#B1B11B" },
                  { offset: 0.7, color: "#BE9B0E" },
                  { offset: 1, color: "#F1F1B8" }
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
        console.log(poem)
       // console.log(poem)
        //弹出提示框信息
       // console.log(poem[0]["year"])
       console.log(poem.length)
      //  console.log(typeof(poem[0]["year"]))
        for(var i=0;i<event.length;i++)
        {
          
          for(var key in event[i])
        {
          if(key==params.name)
          {
            pubsub.publish("pub_bgdata", poem[i]);
            //console.log(poem[i])
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
  height: 100%;
  float: right;
  margin-bottom: 2%;
  color: #6f60aa;
}
#history-container {
  width: 100%;
  height: 100%;
  margin-left: 50px;
}
</style>
