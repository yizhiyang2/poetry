<template>
  <div id="plist">
    <h2>诗集列表</h2>
    <ul id="parent_uls">
    
    </ul>
    <ul id="contents">
      <p class="first_show">
        诗词展示区</p>
    </ul>
  </div>
</template>

<script>
let axios = require("axios");
const d3 = require("d3-dsv");
let jq = require("jquery");
import G2 from "@antv/g2";
import pubsub from "pubsub-js";
export default {
  name: "peotryList",
  data() {
    return {
      cloudType: "",
      mydata: [],
      sliderTime: [701, 762],
      init: ["false"],
      location: "",
      cancel: ["false"],
      bgdata:[],
	  relatedata:[]
    };
  },
  mounted: function() {
    let res = axios.get("/api/LiBai_2020.json").then(res => {
      // var ret = d3.csvParse(res.data)
      for (let i = 0; i < res.data.length; i++) {
        this.mydata.push({
          title: res.data[i].title,
          content: res.data[i].paragraphs,
          explain: res.data[i].explain,
          category: res.data[i].category,
          time: res.data[i].time,
          place: res.data[i].place
        });
      }
      console.log(this.mydata.length)
      this.addList(this.mydata);
    });
    //接受词云点击反馈
    pubsub.subscribe("pub_cloudType", (msg, data) => {
      this.cloudType = data;
      this.addList(this.mydata);
    });
  

    pubsub.subscribe("pub_mapdata", (msg, data) => {
      this.location = data;
      this.addList(this.mydata);
    });

    pubsub.subscribe("Cancel", (msg, data) => {
      this.init[0] = "false";
      this.cloudType = "";
      this.location = "";
      this.cancel[0] = "ture";
      this.addList(this.mydata);
    });
    pubsub.subscribe("pie_poem", (msg, data) => {
      this.bgdata = data;
      this.updataPoem(this.bgdata,this.mydata);
    });
	pubsub.subscribe("relation-poem",(msg,data)=>{
		this.relatedata = data;
		this.updataPoem(this.relatedata,this.mydata);
	})
	// pubsub.subscribe("Slider_time", (msg, data) => {
	//   this.sliderTime = data;
	//   this.init[0] = "ture";
	//   this.addList(this.mydata);
	// });
  },
  methods: {
	clickPoem(data){
			jq("td").click(function() {
			  
			  for (let i = 0; i < data.length; i++) {
			    if (data[i].title == this.innerHTML) {
			      pubsub.publish("pub_peotry", data[i]);
			
			      var contents_ = document.getElementById("contents");
			      jq("p.classp").remove();
			      jq("p.first_show").remove();
			
			      for (let j = 0; j < data[i].content.length; j++) {
			        var p = document.createElement("p");
			        p.innerHTML = data[i].content[j];
			        p.className = "classp";
			
			        contents_.appendChild(p);
			        p.style.color =
			          "rgba(" +
			          Math.random() * 200 / 1 +
			          "," +
			          Math.random() * 200 / 1 +
			          "" +
			          "," +
			          Math.random() * 255 / 1 +
			          ")";
			      }
			      jq("p.classp").fadeIn();
			    }
			  }
			});
		},
	addList(data) {
      var parent_uls = document.getElementById("parent_uls");
      
      var that = this;

      if (!that.cloudType) {
        //不存在词云过滤
        if (that.init[0] == "false") {
          //初始化
         
		  console.log(parent_uls.childElementCount)
		  if(parent_uls.childElementCount !=0) parent_uls.removeChild(parent_uls.childNodes[0]);
		  var table = document.createElement('ul');
		  table.id = "uls";
		  var raw = document.createElement("tr");
		  var i = 0
          for (i = 0; i < data.length; i++) {

              if (i == data.length) break;
              var td = document.createElement("td");
              td.className = "peotries";
              td.innerHTML = data[i].title;
              raw.appendChild(td);
          }
		  console.log(i)
		  console.log(data[i])
		  table.appendChild(raw);
		  parent_uls.appendChild(table)
		  that.init[0] = "true"
		  }
        // } else {
        //   //存在时间过滤
        //   parent_uls.removeChild(parent_uls.childNodes[0]);
        //   var uls = document.createElement("ul");
        //   uls.id = "Timeuls";
        //   // parent_uls.appendChild(uls);
        //   // var mytable = document.getElementById("uls");
        //   var raw = document.createElement("tr");
        //   for (var i = 0; i < data.length; i++) {
        //     if (
        //       data[i].time <= that.sliderTime[1] &&
        //       data[i].time >= that.sliderTime[0]) 
              
        //         if (i == data.length) break;
        //         var td = document.createElement("td");
        //         td.className = "peotries";
        //         td.innerHTML = data[i].title;
        //         raw.appendChild(td);
        //       uls.appendChild(raw);
        //   }
        //   parent_uls.appendChild(uls);
        // }
		
      } else {
        //存在词云过滤
        var test = 0;
        parent_uls.removeChild(parent_uls.childNodes[0]);
        var uls = document.createElement("ul");
        uls.id = "myuls";
        // parent_uls.appendChild(uls);
        //var mytable = document.getElementById("uls");
        var raw = document.createElement("tr");
        for (var i = 0; i < data.length; i++) {
          if (i == data.length) break;
          var str = "";
          for (var iterm in data[i].category) {
            str = str + data[i].category[iterm];
          }

          if (
            str.indexOf(that.cloudType) != -1 &&
            data[i].time <= that.sliderTime[1] &&
            data[i].time >= that.sliderTime[0]
          ) {
            test++;
            //var raw = document.createElement("tr");
            var td = document.createElement("td");
            td.className = "peotries";
            td.innerHTML = data[i].title;
            raw.appendChild(td);
          }
        }
        uls.appendChild(raw)
        parent_uls.appendChild(uls);
       
      }

      if (this.location) {
        parent_uls.removeChild(parent_uls.childNodes[0]);
        var uls = document.createElement("ul");
        uls.id = "localuls";
        // parent_uls.appendChild(uls);
        // var mytable = document.getElementById("uls");
        var raw = document.createElement("tr");
        for (var i = 0; i < data.length; i++) {
          if (i == data.length) break;
          if (
            data[i].place == that.location &&
            data[i].time <= that.sliderTime[1] &&
            data[i].time >= that.sliderTime[0]
          ) {
            var td = document.createElement("td");
            td.className = "peotries";
            td.innerHTML = data[i].title;
            raw.appendChild(td);
            // mytable.appendChild(raw);
          }
          
        }
		uls.appendChild(raw);
		parent_uls.appendChild(uls);
      }

     this.clickPoem(data);

      
    },

    updataPoem(poemName,data)
    {
      if(poemName.length!=0)
      {
        var parent_uls = document.getElementById("parent_uls");
      var table = document.getElementById("uls");
      var that = this;

       parent_uls.removeChild(parent_uls.childNodes[0]);
        var uls = document.createElement("ul");
        uls.id = "bguls";
       
        var raw = document.createElement("tr");
		for (var i = 0; i < poemName.length; i++) {
		  
		    if (i == data.length) break;
		    var td = document.createElement("td");
		    td.className = "peotries";
		    td.innerHTML = data[i].title;
		    raw.appendChild(td);
			
		}
		uls.appendChild(raw);
		parent_uls.appendChild(uls)
		
      }

     this.clickPoem(data);
    }
		
	},
	
};
</script>

<style>
#plist {
  width: 97%;
  height: 62%;
  margin: 1% 1% 1% 1%;
  background: antiquewhite;
  text-align: center;
  overflow: hidden;
  border: 2px solid lightslategrey;
}
#plist ul:nth-child(2) {
  width: 98%;
  height: 28%;
  overflow-x: hidden;
  overflow-y: scroll;
  float: left;
}
h2 {
  width: 100%;
  height: 6%;
  background: #deb887;
  border: 1px solid #aaa;
}

/* tr {
  align-content: center;
  text-align: center;
  float: left;
} */
.peotries {
  margin-left: 5px;
  margin-right: 5px;
  width: 420px;
  height: 50px;
  line-height: 50px;
  border: 1px solid #aaa;
  border-radius: 5px;
}

td:hover {
  cursor: pointer;
  color: firebrick;
  background: #b8860b55;
}
#contents {
  width: 97%;
  height: 50%;
  line-height: 50px;
  background: antiquewhite;
  text-align: center;
  overflow-y: scroll;
  overflow-x: hidden;
}
.classp {
  /* color:; */
  display: none;
  color: darkgreen;
  font-size: 20px;
  font-family: "楷体", "Arial", sans-serif;
}
.first_show {
  margin-top: 25%;
  color: darkgreen;
  font-size: 25px;
  font-family: "楷体", "Arial", sans-serif;
  text-align: center;
  opacity: 0.5;
}
#parent_uls {
  border: 3px solid lightslategrey;
}
th,
td {
  display: block;
}
tr {
  display: block;
  /* float: left; */
  align-content: center;
  text-align: center;
  float: left;
}
table {
  display: block;
}
</style>
