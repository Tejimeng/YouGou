<template>
	<view  class="cart-container" v-if="cart.length !== 0">
		<!-- 收货地址 -->
		<my-address></my-address>
		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cart-title-text">购物车</text>
		</view>

		<!-- 商品列表区域 -->
		<uni-swipe-action>
			<block v-for="(goods,i) in cart" :key="i">
				<uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
					<my-goods @num-change="numberChangeHandler" @radio-change="radioChangeHandler" :showNum="true"
						:goods="goods" :showRadio='true'></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		<!-- 结算区域 -->
		<my-settle></my-settle>
	</view>
	 <!-- 空白购物车区域 -->
	  <view class="empty-cart" v-else>
	    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
	    <text class="tip-text">空空如也~</text>
	  </view>
</template>

<script>
	// 导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		// 将 badgeMix 混入到当前的页面中进行使用
		mixins: [badgeMix],
		computed: {
			...mapState('m_cart', ['cart'])
		},
		data() {
			return {
				options: [{
					text: '删除', // 显示的文本内容
					style: {
						backgroundColor: '#C00000' // 按钮的背景颜色
					}
				}]
			};
		},
		methods: {
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount','removeGoodsById']),
			// 选中按钮的回调
			radioChangeHandler(e) {
				this.updateGoodsState(e)
			},
			// 商品数量的回调
			// 商品的数量发生了变化
			numberChangeHandler(e) {
				this.updateGoodsCount(e)
			},
			// 点击删除按钮的触发函数
			swipeActionClickHandler(goods) {
				this.removeGoodsById(goods.goods_id)
			}
		}
	}
</script>

<style lang="scss">
	.cart-container {
	  padding-bottom: 50px;
	}
	.cart-title {
		height: 40px;
		display: flex;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;

		.cart-title-text {
			margin-left: 10px;
		}
	}
	.empty-cart {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding-top: 150px;
	
	  .empty-img {
	    width: 90px;
	    height: 90px;
	  }
	
	  .tip-text {
	    font-size: 12px;
	    color: gray;
	    margin-top: 15px;
	  }
	}
</style>