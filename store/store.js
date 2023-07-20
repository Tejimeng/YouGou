import Vue from 'vue'
import Vuex from 'vuex'
// 导入小仓库
import moduleCart from './cart.js'
import moduleUser from './user.js'
Vue.use(Vuex)
const store = new Vuex.Store({
	// 用于挂载其他的小仓库
	modules: {
		m_cart: moduleCart,
		m_user: moduleUser
	}
})
//向外暴露
export default store