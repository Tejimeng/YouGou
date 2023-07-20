// 用户收货地址的仓库
export default {
	namespaced: true,
	state: () => ({
		// 收货地址
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
	}),
	mutations: {
		updateAddress(state, address) {
			state.address = address
			this.commit('m_user/saveAddressToStorage')
		},
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		},
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