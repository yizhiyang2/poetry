<template>
  <div id="history">
    <div id="history-container"></div>
  </div>
</template>

<script>
import pubsub from "pubsub-js";
let axios = require("axios");
let jq = require("jquery");
let echarts = require("echarts");
const d3 = require("d3-dsv");
export default {
  name: "poeHistory",
  data() {
    return {
      sliderTime: [701, 711],
      m_history: []
    };
  },
  mounted: function() {
    let res = axios.get("/api/history.csv").then(res => {
      var data = d3.csvParse(res.data);
      let history = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].start == "") continue;
        else {
          history.push({
            time_start: data[i].start,
            time_end: data[i].end,
            event:
              data[i].start +
              "年至" +
              data[i].end +
              "发生" +
              data[i]["名称"] +
              ":" +
              data[i]["影响"]
          });
        }
      }
      this.m_history = history;
      console.log(this.m_history);
      //this.drawhistory(history);
    });
    pubsub.subscribe("Slider_time", (msg, data) => {
      this.sliderTime = data;
      this.drawhistory(this.m_history);
    });
  },

  methods: {
    drawhistory(data) {
      var oDiv = document.getElementById("history-container");
      if (document.getElementById("div2")) {
        oDiv.removeChild(document.getElementById("div2"));
      }
      var oDiv2 = document.createElement("div");
      oDiv2.id = "div2";

      for (var i = 0; i < data.length; i++) {
          console.log(this.sliderTime[1])
        if ((data[i]["time_start"]<= this.sliderTime[1]&&(data[i]["time_end"]>this.sliderTime[0]))) {
          var oP = document.createElement("p");
          oP.innerHTML += data[i]["event"];
          oDiv2.appendChild(oP);
        }
      }
      oDiv.appendChild(oDiv2);
    }
  }
};
</script>

<style scoped>
#history {
  width: 30%;
  height: 50%;
  margin-top: 2%;
  float: right;
  position: relative;
  color: #6f60aa;
}
#history-container {
  width: 100%;
  height: 100%;
}

</style>
