const mutation = {
  info(state,msg){
    state.data1 = msg
  },
  mapdata(state,focus){
    state.mapData = focus
  },
  map(state,focus){
    state.map = focus
  }

}
export default mutation
