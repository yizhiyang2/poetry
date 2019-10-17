<template>
  <div id="history">

  </div>
</template>

<script>
  let axios = require('axios');
  let jq = require('jquery');
  let echarts = require('echarts');
  const d3 = require('d3-dsv');
  export default{
    name:'poeHistory',
    mounted:function(){

      let res = axios.get('/api/history.csv').then(res => {
        var data = d3.csvParse(res.data)
        let history = []
        for(let i=0;i<data.length;i++)
        {
          if(data[i].start == '') continue;
          else{
            history.push({
              x:data[i]['名称'],
              y:[parseInt(data[i].start),parseInt(data[i].end)+1],
              content:data[i]['影响'],
              time:data[i].start+'-'+data[i].end
            })
          }
        }
        console.log(history)
        this.drawhistory(history)

      })
    },

    methods:{
      drawhistory(data){
        var chart = new G2.Chart({
          container: 'history',
          forceFit: true,
          width: innerWidth*0.28,
          height: innerHeight*0.35,
          padding:'auto'
        });

        chart.source(data,{
          y:{
            min:600,
            max:920,
          },
          time:{
            alias:'时间'
          },
          content:{
            alias:'影响'
          }
        });
        // chart.coord('rect').transpose()
        chart.interval().position('x*y')
          .tooltip('time*content').color('#abc');
        chart.render();
      }
    }
  }
</script>

<style>
  #history{
    width: 100%;
    height: 35%;
    background: antiquewhite;
  }
</style>
