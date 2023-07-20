// 购物车仓库
export default {
	// 开启命名空间，使各个仓库之间不影响
	namespaced: true,
	// 模块的 state 数据
	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下 6 个属性：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),
	// mutations用来对state中的数据进行操作
	mutations: {
		// 添加购物信息的方法
		addToCart(state, goods) {
			// 根据商品的id来进行查询商品是否存在，find()返回的是查找到的元素或者undefined
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if (!findResult) {
				state.cart.push(goods)
			} else {
				findResult.goods_count++
			}
			//进行本地储存
			this.commit('m_cart/saveToStorage')
		},
		// 存储到本地储存的方法
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		// 更新购物车中商品的选中状态
		updateGoodsState(state, goods) {
			// 进行查询
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if (findResult) {
				// 修改选中状态
				findResult.goods_state = goods.goods_state
				//进行本地储存
				this.commit('m_cart/saveToStorage')
			}
		},
		// 更新商品的数量
		updateGoodsCount(state, goods) {
			// 根据 goods_id 查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

			if (findResult) {
				// 更新对应商品的数量
				findResult.goods_count = goods.goods_count
				// 持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		// 删除商品
		// 根据 Id 从购物车中删除对应的商品信息
		removeGoodsById(state, goods_id) {
			// 调用数组的 filter 方法进行过滤
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		},
		// 更新所有商品的选中状态
		updateAllGoodsState(state, newState) {
			// 循环更新购物车中每件商品的勾选状态
			state.cart.forEach(x => x.goods_state = newState)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		}
	},
	// 用于外部组件获取state中的数据
	getters: {
		// 返回总的加入购物车中的数量
		total(state) {
			// let c = 0
			// state.cart.forEach(goods => c += goods.goods_count)
			// return c
			return state.cart.reduce((total, item) => total += item.goods_count, 0)
		},
		// 勾选商品的总数量
		checkedCount(state) {
			// 先使用 filter 方法，从购物车中过滤器已勾选的商品
			// 再使用 reduce 方法，将已勾选的商品总数量进行累加
			// reduce() 的返回值就是已勾选的商品的总数量
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
		},
		// 计算所有商品的总价
		checkedGoodsAmount(state) {
			return state.cart.filter(x => x.goods_state).reduce((total, x) => total += x.goods_count * x.goods_price, 0).toFixed(2)
		}
	}
}