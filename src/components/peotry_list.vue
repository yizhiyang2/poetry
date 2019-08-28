<template>
  <div id="plist">
    <h2>诗集列表</h2>
    <ul id="uls">

    </ul>
    <ul id="contents">

    </ul>
  </div>
</template>

<script>
  let axios = require('axios')
  const d3 = require('d3-dsv')
  let jq = require('jquery')
  import G2 from '@antv/g2';
  export default{
    name:'peotryList',
    mounted:function(){
     let res = axios.get('/api/Poet-time.json').then(res => {
       // var ret = d3.csvParse(res.data)
        let data = [];
        for(let i=0;i<res.data.length;i++)
        {
          data.push({
            title:res.data[i].title,
            content:res.data[i].paragraphs
          });
        }
        this.addList(data)
        })

    },
    methods:{
      addList(data){
        var table = document.getElementById('uls');
        for(var i=0;i<data.length;i+=3)
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
        jq('td').click(function(){
          console.log(data)
          for(let i=0;i<data.length;i++)
          {
            if(data[i].title == this.innerHTML){
              var contents_ = document.getElementById('contents');
              jq('p.classp').remove()

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
    width: 500px;
    height: 560px;
    border: 1px solid #aaa;
    background: antiquewhite;
    text-align: center;
    overflow: hidden;
  }
  #plist ul:nth-child(2){
    width: 100%;
    height: 250px;
    overflow-x: hidden;
    overflow-y: scroll;
    float: left;
  }
  h2{
    width: 100%;
    height: 50px;
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
    width: 100%;
    height: 310px;
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
    font-size: 24px;
  }

</style>
