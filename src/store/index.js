import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    filepath: "",
    excelData: []
  },
  mutations: {
    setFilePath(state,val){
      state.filepath = val;
    },
    setExcelData(state,val){
      state.excelData = val;
    }
  },
  actions: {
  },
  modules: {
  }
})
