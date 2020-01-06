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
          let ll=axios.get('/api/LiBai_charonicle2.json').then(ll2=>{
            this.initData(res.data,ll2.data);
            this.$store.commit("map",ll2.data);
          })
      })
    },

    methods:{

      initData(datamap,points2){//处理数据
        // let geopoints = [];
        // let totalpoints = [];
        // let time = ['701'];
        // for(let i=701;i<761;i++)//处理时间轴
        // {
        //   geopoints[i-701]=[];
        //   time.push(i-701);
        //   if(points[i+''] != null){
        //     //console.log(points[i])
        //     for(let j=0;j<points[i+''].places.length;j++)
        //     {
        //       geopoints[i-701].push({
        //         name:points[i+''].places[j],
        //         value:[points[i+''].points[j][0],points[i+''].points[j][1],1]
        //       })
        //       totalpoints.push({
        //         name:points[i+''].places[j],
        //         value:[points[i+''].points[j][0],points[i+''].points[j][1],i-701]
        //       })
        //      }
        //   }else{
        //     //console.log(points[i+''])
        //     geopoints[i-701]=geopoints[i-702];
        //   }
        // }
        //console.log(points2)
        let geopoints = [];
        let totalpoints = [];
        let time = ['705'];
        for(let i=705;i<=762;i++)
        {
          geopoints[i-705]=[];
          time.push(i-705);
          if(points2[i+'']!=null){
            for(let j=0;j<points2[i+''].place.length;j++)
            {
              //console.log(points2[i+''].place.length)
              geopoints[i-705].push({
                name:points2[i+''].place[j],
                value:[points2[i+''].point[j][0],points2[i+''].point[j][1],1]
              })
              totalpoints.push({
                name:points2[i+''].place[j],
                value:[points2[i+''].point[j][0],points2[i+''].point[j][1],i-705]
              })
            }
          }else{
            //console.log(points[i+''])
            geopoints[i-705]=geopoints[i-705-1];
          }
        }


        // console.log(geopoints);
        // console.log(totalpoints);
        // console.log(time)
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
        //console.log(ops)
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
              subtext: '705年-762年',
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
