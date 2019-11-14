<template>
  <div>
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
  import pubsub from 'pubsub-js'
  let echarts = require('echarts')
  let axios = require('axios')
  export default {
    name:'geoMap',
    mounted:function(){

      let res = axios.get('/api/china.json').then(res => {

        let ret = axios.get('/api/LiBai_charonicle.json').then(response => {
          this.initData(res.data,response.data)
          this.store.commit("map",response.data)
        })
      })




    },

    methods:{

      initData(datamap,points){
        let geopoints = [];
        let totalpoints = [];
        let time = ['701'];
        for(let i=701;i<761;i++)
        {
          geopoints[i-701]=[];
          time.push(i-701);
          if(points[i+''] != null)
            for(let j=0;j<points[i+''].places.length;j++)
            {
              geopoints[i-701].push({
                name:points[i+''].places[j],
                value:[points[i+''].points[j][0],points[i+''].points[j][1],1]
              })
              totalpoints.push({
                name:points[i+''].places[j],
                value:[points[i+''].points[j][0],points[i+''].points[j][1],i-701]
              })
            }else{
            geopoints[i-701]=geopoints[i-702];
          }
        }

        let ops = [];

        for(let i=0;i<time.length;i++)
        {
          if(i==0)
            ops.push(
              {
                series:{
                  name: time[i]+'',
                  type: 'effectScatter',
                  coordinateSystem: 'geo',
                  data:totalpoints,
                  symbolSize: 15,
                  label: {
                    show:true,
                    formatter:function(params){
                      return params.name
                    }
                  },
                }
              })
          else ops.push({
            series:{
              name: time[i]+'',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              data:geopoints[i],
              symbolSize: 15,
              label: {
                show:true,
                formatter:function(params){
                  return params.name+'\n'+i
                }
              },
            }
          })
        }
        console.log(ops)
        this.drawMap(datamap,time,ops)
      },

      drawMap(map,time,ops){

        let chart = echarts.init(document.getElementById('map'));
        echarts.registerMap('china',map);

        var option = {
          baseOption:{
            backgroundColor: '#DEB887',
            title: {
              text: '唐朝李白诗人轨迹',
              subtext: '701年-762年',
              x:'center',
            },
            tooltip: {
              show:false
            },
            timeline:{
              axisType: 'category',
              symbol:'none',
              playInterval:1000,
              left:null,
              orient:'vertical',
              right:-10,
              top:20,
              bottom:0,
              width:50,
              controlStyle:{
                showNextBtn: false,
                showPrevBtn: false,
                normal: {
                  color: '#666',
                  borderColor: '#666'
                },
                emphasis: {
                  color: '#aaa',
                  borderColor: '#aaa'
                }
              },
              data:time
            },
            geo: {
              map: 'china',
              center:[115.9199,33.1904],
              zoom:0,
              itemStyle: {
                shadowBlur:5,
              },
              roam:true,
              scaleLimit:{
                min:2,
                max:10
              }
            },
            series:[
              {
                type:'effectScatter',
                coordinateSystem: 'geo',
              }
            ]
          },

          options:ops

        }
        chart.setOption(option);

        chart.on('click', (d)=>{
          // this.$store.commit('mapdata',d.value)
          pubsub.publish('pub_mapdata',d)

        })

      }
    }
  }
</script>

<style>
  #map{
    width: 80%;
    height: 60%;
    position: absolute;
  }

  #photo{
    position: absolute;
    margin-left: 5px;
    margin-top: 5px;
  } 
#photo img{
    width: 15%;
    height: 25%;
  }
  #intro{
    float: left;
    margin-top: 40px;
    color: #555;
  }
  #intro p{
    font-size: 12px;
    margin: 5px;
  }
</style>
