<template>
  <div id="plist">
    <h2>诗集列表</h2>
    <ul id="parent_uls">
    <ul id="uls">
    </ul>
    </ul>
    <ul id="contents">
      <p class="first_show">
        诗词展示区</p>
    </ul>
  </div>
</template>

<script>
  let axios = require('axios')
  const d3 = require('d3-dsv')
  let jq = require('jquery')
  import G2 from '@antv/g2';
  import pubsub from 'pubsub-js'
  export default{
    name:'peotryList',
    data() {
        return {
          cloudType:'',
          mydata:[]
        }
    },
    mounted:function(){
      let res = axios.get('/api/Poet-time.json').then(res => {
        // var ret = d3.csvParse(res.data)
        for(let i=0;i<res.data.length;i++)
        {
          this.mydata.push({
            title:res.data[i].title,
            content:res.data[i].paragraphs,
            explain:res.data[i].explain,
            category:res.data[i].category
          });
        }
        this.addList(this.mydata)
      });
      //接受词云点击反馈
      pubsub.subscribe('pub_cloudType', (msg, data) => {
        this.cloudType=data;
        this.addList(this.mydata);
      })
    },
    methods:{
      addList(data){
        var parent_uls=document.getElementById('parent_uls')
        var table = document.getElementById('uls');
        var  that=this;
          if(!that.cloudType)
          {
            for(var i=0;i<data.length;i++)
            {
             var raw = document.createElement('tr');
              // for(var j=0;j<3;j++)
              {
                if(i == data.length) break;
                var td = document.createElement('td');
                td.className = 'peotries'
                td.innerHTML = data[i].title;
                raw.appendChild(td)
              }
              table.appendChild(raw)
            }
          }
          else
          {
            parent_uls.removeChild(parent_uls.childNodes[0]);
            var uls=document.createElement('ul');
            uls.id='uls';
            parent_uls.appendChild(uls);
            var mytable = document.getElementById('uls');
            for(var i=0;i<data.length;i++)
            {
              if(i == data.length) break;
              var str='';
              for(var iterm in data[i].category)
              {
                 str=str+data[i].category[iterm]
              }
              // console.log(str);
              // console.log(str.indexOf(that.cloudType) != -1);
              if(str.indexOf(that.cloudType) != -1)
                {
                var raw = document.createElement('tr');
                var td = document.createElement('td');
                td.className = 'peotries'
                td.innerHTML = data[i].title;
                raw.appendChild(td);
                mytable.appendChild(raw)
                }
              }
            }

        jq('td').click(function(){
          console.log(data)
          for(let i=0;i<data.length;i++)
          {
            if(data[i].title == this.innerHTML){

              pubsub.publish('pub_peotry',data[i]);

              var contents_ = document.getElementById('contents');
              jq('p.classp').remove()
              jq('p.first_show').remove()

              for(let j=0;j<data[i].content.length;j++)
              {
                var p =document.createElement('p')
                p.innerHTML = data[i].content[j]
                p.className = 'classp'

                contents_.appendChild(p)
                p.style.color = 'rgba('+ Math.random()*200/1 +','+Math.random()*200/1+''+','+Math.random()*255/1+')';

              }
              jq('p.classp').fadeIn();
            }
          }
        })

      },


    }
  }

</script>

<style>
  #plist{
    width: 97%;
    height: 62%;
    margin: 2% 1% 1% 1%;
    border: 1px solid #aaa;
    background: antiquewhite;
    text-align: center;
    overflow: hidden;
    border: 3px solid #000;
  }
  #plist ul:nth-child(2){
    width: 98%;
    height: 28%;
    overflow-x: hidden;
    overflow-y: scroll;
    float: left;
  }
  h2{
    width: 100%;
    height: 6%;
    background: #DEB887;
    border: 1px solid #aaa;
  }

  tr{
    align-content: center;
    text-align: center;
  }
  .peotries{
    margin-left: 5px;
    margin-right: 5px;
    width: 580px;
    height: 50px;
    line-height: 50px;
    border: 1px solid #aaa;
    border-radius: 5px;
  }

  tr:hover{
    cursor: pointer;
    color: firebrick;
    background: #B8860B55;
  }
  #contents{
    width: 97%;
    height: 50%;
    line-height: 50px;
    background: antiquewhite;
    text-align: center;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .classp{
    /* color:; */
    display: none;
    color: darkgreen;
    font-size: 20px;
    font-family: "楷体", "Arial", sans-serif
  }
  .first_show{
    margin-top: 25%;
    color: darkgreen;
    font-size: 25px;
    font-family: "楷体", "Arial", sans-serif;
    text-align: center;
    opacity:0.5;
  }
  #parent_uls{
    border: 3px solid #000;
  }

</style>
