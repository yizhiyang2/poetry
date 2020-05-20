npm run<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">
    <router-view/> -->
    <div class="left">
      <bg-pie-chart></bg-pie-chart>
      <peotryList class='list'></peotryList>
    </div>

    <div class="center">
      <peoMap class='china_map'></peoMap>
      <!-- <peo-event class="event"></peo-event> -->
      <!-- <peo-history></peo-history> -->
	  <choose-poet></choose-poet>
    </div>

    <!-- <div class="right">
      <peo-history></peo-history>
      <peo-relation class='relation'></peo-relation>
    </div> -->
    <!-- <peo-history></peo-history> -->
    <div class="bottom"> 
       <peo-slider></peo-slider>
      <!-- <peo-note></peo-note> -->
      <!-- <peo-history></peo-history> -->
      <peo-relation></peo-relation>
	<clouds class='cloud'></clouds>
    </div>
  </div>
</template>

<script>
  import clouds from './components/clouds';
  import peotryList from './components/peotry_list';
  import peoMap from './components/map';
  import peoRelation from './components/relationship';
  import peoHistory from './components/bgevents';
  // import peoNote from './components/peotry_note';/
  import peoSlider from './components/Slider';
  import VueSlider from 'vue-slider-component'
  import choosePoet from './components/choosepoet';
  // import peoEvent from './components/peo_event'
	import bgPieChart from './components/bgPieChart'
  import 'vue-slider-component/theme/default.css'

  export default {
    name: 'App',
    components:{
      clouds,
      peotryList,
      peoMap,
      peoRelation,
      peoHistory,
      // peoNote,
      peoSlider,
      VueSlider,
			choosePoet,
			bgPieChart
      // peoEvent
    },
    data: function () {
      return {

      }
    }
  }
</script>

<style>
  *{
    padding: 0;
    margin: 0;
  }
  body{
    width: 100%;
    height: 100%;
    background: burlywood;
    position: absolute;
  }
  #app{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
  }
  .left{
    float:left;
    height: 100%;
    width: 25%;
  }
  .center{
    float: left;
    width: 75%;
    height: 60%;
    position:relative;
    /* height: 100%; */
  }
  /* .right{
    float: right;
    height: 100%;
    right: 0px;
    width: 35%;
    box-shadow: -2px 0px 10px saddlebrown;
  } */
  /* .relation{
    margin-right: 10%;
    background: whitesmoke;
  } */
  .bottom{
    position: absolute;
    height: 40%;
    width: 75%;
    bottom: 0;
    margin-bottom: 2%;
    right:0 ;
  }
  

</style>
