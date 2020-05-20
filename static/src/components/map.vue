<template>
  <div id="map_container">
    <div id="map">
    </div>
    <div id="photo">
      <img src="../../static/libai_photo.jpg" />
      <div id="intro">
        <p>诗人：李白</p>
        <p>701年-762年</p>
        <p>字：太白</p>
        <p>号：青莲居士</p>
      </div>
    </div>
  </div>

</template>
<script>
import pubsub from "pubsub-js";
let echarts = require("echarts");
let axios = require("axios");

export default {
  name: "geoMap",
  data() {
    return {
      sliderTime: [701, 762],
	  chart:null
    };
  },
  mounted: function() {
    var map, point;
    let res = axios.get("/api/china.json").then(res => {
      let ll = axios.get("/api/LiBai_charonicle2.json").then(ll2 => {
        map = res.data;
        point = ll2.data;
        this.initData(res.data, ll2.data);
      });
    });

    pubsub.subscribe("Slider_time", (msg, data) => {
      this.sliderTime = data;
	  this.$data.chart.clear();
      this.initData(map, point);
    });
  },

  methods: {
    initData(datamap, points2) {
      var pointData = [];
      var lastLocal="";
      for (let i = this.sliderTime[0]; i <= this.sliderTime[1]; i++) {
        if (points2[i]) {
          for (let j = 0; j < points2[i].place.length; j++) {
            if(!(lastLocal==points2[i]["place"][j]))
            {
              pointData.push({
              name: points2[i]["place"][j],
              value: points2[i]["point"][j]
            });
            lastLocal=points2[i]["place"][j];
            }
          }
        }
      }
      var mydata = pointData;
      this.drawMap(datamap, mydata);
    },
    drawMap(map, mydata) {
      // 将坐标与值对应并反映在地图上
       this.$data.chart = echarts.init(document.getElementById("map"));
	   
      echarts.registerMap("china", map);

      var option = {
        baseOption: {
          backgroundColor: "#DEB887",
          title: {
            text: "唐朝李白诗人轨迹",
            subtext: "705年-762年",
            x: "center"
          },
          tooltip: {
            show: false
          },
          geo: {
            map: "china",
            center: [115.9199, 33.1904],
            zoom: 0,
            itemStyle: {
              shadowBlur: 5
            },
            roam: true,
            scaleLimit: {
              min: 1,
              max: 10
            }
          },
          //触碰文字
          tooltip: {
            trigger: "item",
            formatter: function(params) {
              return params.name;
            }
          },
          series: [
            {
              type: "effectScatter",
              coordinateSystem: "geo",
              data: mydata,
              symbolSize: 12,
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              itemStyle: {
                emphasis: {
                  borderColor: "#fff",
                  borderWidth: 1
                }
              }
            }
          ]
        }
      };
      this.$data.chart.setOption(option);

      this.$data.chart.on("click",function(d){
		  
		if(d.componentType == "geo") alert("请点击地图标记点。")
		else{
			console.log("publish map data")
			pubsub.publish("pub_mapdata", d["data"]["name"]);
		}
		// else{
		// 	pubsub.publish("pub_mapdata", d["data"]["name"]);
		// }
        // try {
        //   
        // } catch (err) {
        //   alert("请点击地图标记点。");
        // }
      });
    }
  }
};
</script>

<style>
#map {
  width: 90%;
  height: 90%;
  position: absolute;
}

#photo {
  margin-left: 5px;
  margin-top: 5px;
  width: 35%;
  position: relative;
}
#photo img {
  width: 15%;
  height: 25%;
  float: left;
}
#intro {
  float: left;
  margin-top: 10px;
  color: #555;
}
#intro p {
  font-size: 12px;
  margin: 5px;
}
</style>
