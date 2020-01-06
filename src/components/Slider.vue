<template>
  <div id='slider' class="slider_container">
      <span>时间：{{value_2[0]}}~{{value_2[1]}}</span>
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
        value_2: [701, 711],
        m_value:[],
        min:701,
        max:762
    };
  },
  mounted() {
     
  },
    watch: {
    //If data is updated, change chart source
    value_2: function() {
      pubsub.publish('Slider_time',this.value_2);
    }
  },
  methods: {

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
#slider{
    width: 80%;
}
</style>
