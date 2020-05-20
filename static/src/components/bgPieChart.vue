<template>
	<div id="pie-container">
		<div id="poem-num"></div>	
	</div>
	
</template>

<script>
	let axios = require("axios");
	let echarts = require("echarts");
	const d3 = require('d3-dsv')
	import pubsub from "pubsub-js";
	export default{
		name:"poem-num",
		data(){
			return{
				legendData:[],
				seriesData:[],
				selected:{},
				poem:[],
				event:[]
			}
		},
		mounted:function(){
			
			axios.get('/api/政治.json').then(res=>{
				
				let count=0
				for(var i=0;i<res.data.length;i++){
					this.$data.legendData.push(res.data[i].time+"年")
					this.$data.seriesData.push({
						name:res.data[i].time+'年',
						value:res.data[i].num,
					})
					count++;
					this.$data.selected[res.data[i].time+'年']= i<5;
					this.$data.poem.push(res.data[i].poem)
					this.$data.event.push(res.data[i].event)
				}
				
				this.draw()
			})
			pubsub.subscribe('history',(msg,data)=>{
				if(data[0]>701 &&data[1]+data[0]<762){
					for(let i=731;i<761;i++){
						if(this.$data.selected[i+'年'] != undefined)
						this.$data.selected[i+'年']=false;
					}
					for(let i=data[0];i<data[0]+data[1];i++)
					{
						if(this.$data.selected[i+'年'] != undefined) {
							this.$data.selected[i+'年']=true;
						}
					}
				}else{
					alert('超出李白身平时间')
				}
			this.draw()
			})
		},
		
		methods:{
			draw(){
				
				var chart =echarts.init(document.getElementById('poem-num'))
				
				var option = {
				    title: {
				        text: '诗词数量',
				        left: 'center'
				    },
				    tooltip: {
				        trigger: 'item',
				        formatter: '{a} <br/>{b} : {c} ({d}%)'
				    },
				    legend: {
				        type: 'scroll',
				        orient: 'vertical',
				        right: 20,
				        top: 30,
				        bottom: 30,
				        data: this.$data.legendData,
				        selected: this.$data.selected,
						
				    },
				    series: [
				        {
				            name: '数量',
				            type: 'pie',
				            radius: '70%',
				            center: ['40%', '50%'],
				            data: this.$data.seriesData,
				            emphasis: {
				                itemStyle: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ]
				};
				
				chart.setOption(option)
				var that=this;
				chart.on("click",function(d){
					alert(that.$data.event[d.dataIndex]);
					pubsub.publish("pie_poem",that.$data.poem[d.dataIndex]);
				})
			}
		},
		
	}
	
</script>

<style>
	#pie-container{
		margin-right:2%;
		width: 97%;
		height: 35%;
		border: 3px solid lightslategrey;
		background: white;
	}
	
	#poem-num{
		width: 100%;
		height: 100%;
		border: 2px solid lightslategrey;
	}
		
	
</style>
