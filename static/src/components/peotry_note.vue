<template>
  <div id="peotry_note">
  <div id="note_container">
    <p id="explain" style=" text-align: center;color:#c76968"> {{title}}<br></p>
    <p id="first_note">{{first_note}}</p>
    <p id="title">{{note}}</p>
  </div>
  </div>
</template>

<script>
  import pubsub from 'pubsub-js'
  let axios = require('axios');
  let jq = require('jquery');
  let echarts = require('echarts');
  const d3 = require('d3-dsv');
  export default{
    name:'peotryNote',
    data() {
        return {
           title:'',
           note:'',
           first_note:'诗词展示区'
        }
    },
    mounted:function(){
        pubsub.subscribe('pub_peotry', (msg, data) => {
            var arr=[];
            arr=data.explain
            var str='';
            this.first_note='';
            for(var iterm in arr)
            {
                str=str+arr[iterm];
            }
            if(str=='None')
            {
                str='抱歉，暂无注释！'
            }
            this.title=data.title;
            this.note=str;
      })
    },
    methods:{

    }
  };
</script>

<style>
  #peotry_note{
    width: 48%;
    height:87%;
    margin: 2% 1% 1% 0;
    left: 0;
    background: antiquewhite;
    float: left;
    border: 2px solid #000;
    
  }
  #note_container
  {
    width: 98%;
    height: 98%;
    color: darkgreen;
    font-size: 18px;
    font-family: "楷体", "Arial", sans-serif;
    opacity:0.8;
    overflow:scroll; 
    overflow-x:auto;
  }
  #first_note
  {
    color: darkgreen;
    font-size: 25px;
    font-family: "楷体", "Arial", sans-serif;
    text-align: center;
    opacity:0.5;
  }
</style>
