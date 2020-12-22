import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        filepath: "",
        excelData: [],
        page_refresh_time: 30,
    },
    mutations: {
        setFilePath(state, val) {
            state.filepath = val;
        },
        setExcelData(state, val) {
            state.excelData = val;
        },
        setpageRefreshTime(state, val) {
            state.page_refresh_time = val;
        }
    },
    actions: {},
    modules: {}
})
