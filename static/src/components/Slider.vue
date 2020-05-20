<template>
  <div id='slider' class="slider_container">
      <span>时间：{{value_2[0]}}~{{value_2[1]}}</span>
      <span>关键词：{{keyWord}}</span>
      <span>地点：{{place}}</span>
      <button id="mybtn"  @click="myFunction">点击取消</button>
       <vue-slider ref="slider" v-model="value_2" :min="min"
      :max="max"></vue-slider>
  </div>
</template>

<script>
import pubsub from 'pubsub-js'
export default {
  name: "slider",
  data() {
    return {
        value_2: [701, 762],
        m_value:[],
        min:701,
        max:762,
        keyWord:'',
        place:''
    };
  },
  mounted() {
      pubsub.subscribe("pub_mapdata", (msg, data) => {
      console.log(data)
		this.place=data
    });

      pubsub.subscribe("pub_cloudType", (msg, data) => {
      this.keyWord = data;
      this.place=''
    });
     
  },
    watch: {
    //If data is updated, change chart source
    value_2: function() {
      pubsub.publish('Slider_time',this.value_2);
    }
  },
  methods: {
    myFunction()
    {
      var choose="cancel"
      this.place=''
      this.keyWord=''
      pubsub.publish('Cancel',choose);
    }

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
#slider{
    width: 60%;
	margin-right: 20%;
}
#mybtn {

background-color: #4CAF50;

border: none;

color: white;

text-align: center;

text-decoration: none;

display: inline-block;

cursor: pointer;

}

</style>
