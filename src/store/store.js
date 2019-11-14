import Vue from 'vue'
import Vuex from 'vuex'
import mutation from "./mutation";
import getter from "./getter";
Vue.use(Vuex)

const state = {
  mapData:"",
  map:''
}

export default new Vuex.Store({
  state:state,
  mutations: mutation,
  getters: getter
})
