<template>
	<div id="hstry">
		<div id="hstry-con"></div>
	</div>
</template>

<script>
	let axios = require("axios");
	let echarts = require("echarts");
	const d3 = require('d3-dsv')
	import pubsub from "pubsub-js";
	
	export default{
		name:"hstry",
		mounted:function(){
		var data=new Array();
		
		axios.get("/api/history.csv").then(res=>{
			var basicData=[]
			var partData=[]
			var name=[];
			var infect=[];
				var data = d3.csvParse(res.data)
				for(var i=0;i<data.length;i++){
					if(data[i].start != ''){
						basicData.push(data[i].start-600)
						partData.push(data[i].end-data[i].start+1)
						name.push(data[i]['名称'])
						infect.push(data[i]['影响'])
					}
					
				}
				this.draw(basicData,partData,name,infect)
				
			})
			
		},
		methods:{
			draw(basicData,partData,name,infect){
				var data = [0,10,20,55,14,13,97,56,84,55,36,15,23,19,14,12,7,4]
				var chart = echarts.init(document.getElementById("hstry-con"))
				var option = {
				    title: {
				        text: '历史事件与作词数量',
				        x:50,
						y:20
				    },
				    tooltip: {
				    	
						trigger: 'axis',
				        formatter: function (params) {
				            var tar;
				            if (params[1].value !== '-') {
				                tar = params[1];
				            }
				            else {
				                tar = params[0];
				            }
				            return tar.name + '<br/>' + 
									tar.seriesName + ' : ' + tar.value+'年';
				        },
				    	 axisPointer: {
				    	    type: 'cross',
				    	    crossStyle: {
								color: '#999'
				    	    },
							label:{
								
								precision:0
							}
				    	 }
				    },
				   
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis: [{ 
						    type: 'value',
							position:'top',
							axisLabel: {
								formatter: function(value){
									return value+600
								},
							},
							axisLine:{
								lineStyle:{
									color:'rgba(111,111,111,1)',
									width:2
								}
							},
						},
						{
							type:'value',
							position:'bottom',
							
							axisLine:{
								lineStyle:{
									color:'rgba(190,14,14,1)',
									width:2
								}
								
							},
						},
					],
				      
				    yAxis: {
				        type: 'category',
						splitLine:{show:false},
						axisLine:{
							lineStyle:{
								color:'rgba()',
								width:2
							}
							
						},
						data:name,
						inverse:true
				    },
				    series: [
				        {
				            name: '开始',
				            type: 'bar',
				            stack: '总量',
				            itemStyle: {
				                barBorderColor: 'rgba(0,0,0,0)',
				                color: 'rgba(0,0,0,0)'
				            },
				            emphasis: {
				                itemStyle: {
				                    barBorderColor: 'rgba(0,0,0,0)',
				                    color: 'rgba(0,0,0,0)'
				                }
				            },
				            data: basicData,
							xAxisIndex:0,
							
				        },
				        {
				            name: '持续时间',
				            type: 'bar',
				            stack: '总量',
				            
							itemStyle:{
								color:'rgba(111,111,111,1)'
							},
				            data: partData,
							xAxisIndex:0,
							
				        },
						{
							name:"作词数量",
							type:'line',
							lineStyle:{
								color:'rgba(190,14,14,1)',
								width:5
							},
							data:data,
							xAxisIndex:1,
						}
				       
				    ]
				};
				chart.setOption(option)
				
				this.clickIt(chart,basicData)
			},
		
			clickIt(chart,basicData){
				chart.on("click",function(d){
					
					let time=[basicData[d.dataIndex]+600,d.value]
					pubsub.publish("history",time)
				})
			}
		
		}
	}
	
</script>

<style>
	#hstry{
		width: 40%;
		height: 100%;
		float: right;
		margin-bottom: 2%;
	}
	#hstry-con{
		width: 85%;
		height: 100%;
		margin-left: 10%;
		
	}
</style>
