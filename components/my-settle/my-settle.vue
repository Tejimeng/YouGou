<template>
	<!-- 最外层的容器 -->
	<view class="my-settle-container">
		<!-- 全选区域 -->
		<label class="radio" @click="changeAllState">
			<radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
		</label>

		<!-- 合计区域 -->
		<view class="amount-box">
			合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>

		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		name: "my-settle",
		computed: {
			...mapState('m_cart', ['cart']),
			...mapState('m_user', ['token']),
			...mapGetters('m_user', ['addstr']),
			...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
			// 是否全选
			isFullCheck() {
				return this.total === this.checkedCount
			},
		},
		data() {
			return {

			};
		},
		methods: {
			...mapMutations('m_cart', ['updateAllGoodsState']),
			...mapMutations('m_user', ['updateRedirectInfo']),
			// 全选按钮
			changeAllState() {
				this.updateAllGoodsState(!this.isFullCheck)
			},
			// 结算按钮
			settlement() {
				// 是否已经选择了商品
				if (!this.checkedCount) return uni.showToast({
					title: "请选择要购买的商品！",
					icon: 'none'
				})
				// 是否填写了收货地址
				if (!this.addstr) return uni.showToast({
					title: "请选择要收货地址！",
					icon: 'none'
				})
				// 是否登录
				if (!this.token) return this.delayNavigate()
				// 进行结算支付
				this.payOrder()
			},
			// 未登录的跳转函数
			delayNavigate() {
				uni.showModal({
					title: "请先登录！",
					icon: 'none',
					duration: 1500,
					mask: true,
					success: (res) => {
						if (res.confirm) {
							uni.switchTab({
								url: '/pages/my/my'
							})
							// 传入要重定向的地址
							this.updateRedirectInfo({
								openType: 'switchTab',
								from: '/pages/cart/cart'
							})
						}
					}
				})
			},
			// 微信支付函数
			async payOrder() {
				// 1.1 创建后端需要的订单信息
				const orderInfo = {
					// order_price:this.checkedGoodsAmount
					order_price: 0.01,
					consignee_addr: this.addstr,
					goods: this.cart.filter(x => x.goods_state).map(x => {
						return {
							goods_id: x.goods_id,
							goods_number: x.goods_count,
							goods_price: x.goods_price
						}
					})
				}
				// 1.2 发起请求创建订单
				const {
					data: res
				} = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
				if (res.meta.status !== 200) return uni.showToast({
					title: '创建订单失败!',
					icon: 'none'
				})
				// 1.3 得到服务器响应的“订单编号”
				const orderNumber = res.message.order_number
				// 1.4. 订单预支付
				// 1.4.1根据订单编号来发起订单的预支付信息(参数)
				const {
					data: res2
				} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
					order_number: orderNumber
				})
				// 1.4.2预支付失败
				if (res2.meta.status !== 200) return uni.showToast({
					title: '预付订单生成失败!',
					icon: 'none'
				})
				// 1.4.3得到订单支付相关的必要参数，用来生成真正的支付订单
				const payInfo = res2.message.pay
				// 1.5 发起微信支付
				// 1.5.1调用 uni.requestPayment() 发起微信支付
				const [err, succ] = await uni.requestPayment(payInfo)
				console.log(err);
				console.log(succ);
				// 1.5.2未完成支付
				if (err) return uni.showToast({
					title: '1订单未支付!',
					icon: 'none'
				})
				// 1.5.3完成了支付，进一步查询支付的结果
				const {
					data: res3
				} = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
					order_number: orderNumber
				})
				// 1.5.4检测到订单未支付
				if (res3.meta.status !== 200) return uni.showToast({
					title: '2订单未支付!',
					icon: 'none'
				})
				// 1.5.5检测到订单支付完成
				uni.showToast({
					title: '支付完成！',
					icon: 'success'
				})
			}
		}
	}
</script>

<style lang="scss">
	.my-settle-container {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		// 将背景色从 cyan 改为 white
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 5px;
		font-size: 14px;

		.radio {
			display: flex;
			align-items: center;
		}

		.amount {
			color: #c00000;
		}

		.btn-settle {
			height: 50px;
			min-width: 100px;
			background-color: #c00000;
			color: white;
			line-height: 50px;
			text-align: center;
			padding: 0 10px;
		}
	}
</style>