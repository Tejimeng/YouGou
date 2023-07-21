// 用户收货地址的仓库
export default {
	namespaced: true,
	state: () => ({
		// 收货地址
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		// 登录之后token字符串
		token: uni.getStorageSync('token') || '',
		// 用户的个人信息
		userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
		// 重定向的object对象{openType,from}
		redirction: null
	}),
	mutations: {
		// 更新用户的收货地址
		updateAddress(state, address) {
			state.address = address
			this.commit('m_user/saveAddressToStorage')
		},
		// 进行地址的本地储存
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		},
		// 更新用户的个人信息
		updateUserInfo(state, userinfo) {
			state.userinfo = userinfo
			// 进行本地储存
			this.commit('m_user/saveUserInfoToStorage')
		},
		// 进行用户信息的本地储存
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
		},
		// 更新 token 字符串
		updateToken(state, token) {
			state.token = token
			// 通过 this.commit() 方法，调用 m_user 模块下的 saveTokenToStorage 方法，将 token 字符串持久化存储到本地
			this.commit('m_user/saveTokenToStorage')
		},
		// 将 token 字符串持久化存储到本地
		saveTokenToStorage(state) {
			uni.setStorageSync('token', state.token)
		},
		// 更新重定向的信息对象
		updateRedirectInfo(state, info) {
			state.redirction = info
		}
	},
	getters: {
		// 拼接地址信息
		addstr(state) {
			// 没有就返回空字符串
			// if (!state.address.proviceName) return ''
			// 进行拼接
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address
				.detailInfo
		}
	}
}