// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from './store/store.js'
Vue.config.productionTip = false
import {
	$http
} from '@escook/request-miniprogram'

uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 请求开始之前做一些事情
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...',
	})
	// 判断请求的是否为有权限的接口
	if (options.url.indexOf('/my') !== -1) {
		// 添加头部字段
		options.header = {
			// 获取个人用户信息中的token字段
			Authorization: store.state.m_user.token
		}
	}
}

// 请求完成之后做一些事情
$http.afterRequest = function(res) {
	uni.hideLoading()
	if (res.data.meta.status !== 200) {
		uni.showToast({
			title: "请求发生错误！",
			duration: 1500,
			icon: 'none',
		})
	}

}
App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif