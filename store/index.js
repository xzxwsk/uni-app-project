import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		loginProvider: '',
		sessionId: null,
		openid: null,
		userInfo: {},
		wxUserInfo: {},
		changeNum: null,
		billJoinDAL: null, // 缓存分销商加盟单信息
		consumeSelected: [], // 创建消费/零售记录时，保存
		payRefund: null, // 提现申请单支付信息
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.loginProvider = provider;
		},
		logout(state) {
			state.hasLogin = false
			state.openid = null
		},
		setSessionId(state, sessionId) {
			state.sessionId = sessionId
		},
		setOpenid(state, openid) {
			state.openid = openid
		},
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo
		},
		setWxUserInfo(state, userInfo) {
			state.wxUserInfo = userInfo
		},
		setChangeNum(state, changeNum) {
			state.changeNum = changeNum
		},
		setBillJoinDAL(state, billJoinDALData) {
			state.billJoinDAL = billJoinDALData
		},
		setConsumeSelected(state, val) {
			state.consumeSelected = val
		},
		setPayRefund(state, val) {
			state.payRefund = val
		},
	},
	actions: {
		// lazy loading openid
		getUserOpenId: function ({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				if (state.openid) {
					resolve(state.openid)
				} else {
					uni.login({
						success: (data) => {
							commit('login')
							setTimeout(function () { //模拟异步请求服务器获取 openid
								const openid = '123456789'
								console.log('uni.request mock openid[' + openid + ']');
								commit('setOpenid', openid)
								resolve(openid)
							}, 1000)
						},
						fail: (err) => {
							console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
							reject(err)
						}
					})
				}
			})
		}
	}
})

export default store
