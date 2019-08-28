<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">
    <router-view/> -->
    <div class="left">
      <clouds class='cloud'></clouds>
      <peotryList class='list'></peotryList>
    </div>

    <div class="center">
      <peoMap class='china_map'></peoMap>
    </div>

    <div class="right">
      <peo-history></peo-history>
      <peo-relation class='relation'></peo-relation>


    </div>
  </div>
</template>

<script>
 import clouds from './components/clouds';
 import peotryList from './components/peotry_list';
 import peoMap from './components/map';
 import peoRelation from './components/relationship';
 import peoHistory from './components/bgevents'

export default {
  name: 'App',
  components:{
    clouds,
    peotryList,
    peoMap,
    peoRelation,
    peoHistory
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
}
#app{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.left{
  float:left;
  height: 100%;
  width: 25%;
}
.center{
  float: left;
  width: 30%;
  /* height: 100%; */
}
.right{
  float: right;
  height: 100%;
  right: 0px;
  width: 35%;
  box-shadow: -2px 0px 10px saddlebrown;
}
.relation{
  margin-right: 50px;
  background: whitesmoke;
}

</style>
