<template>
  <div id="outer">
    <div id="relation"></div>
  </div>

</template>

<script>
  let axios = require('axios')
  let jq = require('jquery')
  let echarts = require('echarts');
  export default{
    name:'poeRelation',
    mounted:function(){
      let res = axios.get('/api/friends.json').then(res => {
        let data = res.data
        let graph = {};
        graph.node=[]
        graph.links = [],
          graph.category = [{name:'00'}]
        graph.node.push({
          name:"李白",
          symbolSize:40,
          tooltip:{
            show:false
          },
          label: {
            show: true
          },
          category:'00'
        })
        for(let i=0;i<data.length;i++)
        {
          graph.node.push({
            name:data[i].name,
            symbolSize:10+data[i].value*10,
            tooltip:{
              show:false
            },
            label: {
              show: true
            },
            category:1+i+''
          })
          graph.category.push({
            name:1+i+''
          })
        }
        for(let i=0;i<data.length;i++)
        {
          graph.links.push({
            source:"李白",
            target:data[i].name,
            lineStyle: {
              width: data[i].value,
              // curveness: 0.3,
            }
          })
        }
        this.draw(graph)
      })
    },
    methods:{
      draw(graph){
        let option = {
          title:{
            text:"关系图谱",
            left:20
          },
          animationDurationUpdate: 500,
          animationEasingUpdate: "quinticInOut",

          series: [{
            type: "graph",
            layout: "force",
            roam: true,
            hoverAnimation: true,
            focusNodeAdjacency: true,
            draggable: true,
            symbolSize: 33,
            animation:false,
            force: {
              repulsion: 200,
              edgeLength: [5,20]
            },
            emphasis: {
              itemStyle: {
                borderWidth: 3
              },
              lineStyle: {
                color: '#f00',
                width: 3,
              }
            },
            itemStyle: {
              normal: {
                borderColor: "#fff",
                borderWidth: 1,
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.3)"
              },
            },
            data:graph.node,
            links: graph.links,
            categories:graph.category
          }]
        }

        var myChart = echarts.init(document.getElementById('relation'));
        myChart.setOption(option)
      }

    }
  }
</script>

<style>
  #outer{
    /* margin-left: 50px; */
    width: 49%;
    height: 100%;
    margin-top: 2%;
    /* border:1px solid #aaa; */
    float: left;
    background:#DEB887;
    
  }
  #relation{
    width: 100%;
    height: 100%;
    /* margin-left: -60%; */
    float: left;
    left: 2px;
    background:#DEB887;
    border: 2px solid #000;
  }
</style>
