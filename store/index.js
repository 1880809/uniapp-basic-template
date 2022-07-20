//引用Vuex
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
	state: {

	},
	mutations: {
		// 储存登录信息方法
		SET_LOGIN_INFO: (state, loginInfo) => {
			state.loginInfo = loginInfo
			uni.setStorageSync('token', state.loginInfo.token)
		},
	},
	actions: {

	}
})
