<template>
	<view class="goods-item">
		<!-- 商品左侧图片区域 -->
		<view class="goods-item-left">
			<radio @click="radioClickHandler" v-if="showRadio" :checked="goods.goods_state" color="#c00000"></radio>
			<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
		</view>
		<!-- 商品右侧信息区域 -->
		<view class="goods-item-right">
			<!-- 商品标题 -->
			<view class="goods-name">{{goods.goods_name}}</view>
			<view class="goods-info-box">
				<!-- 商品价格 -->
				<view class="goods-price">￥{{tofixed}}</view>
				<!-- 加购的商品数量 -->
				<uni-number-box v-if="showNum" @change="numChangeHandler" :min="1" :value="goods.goods_count"
					background="#ccc" color="#000" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-goods",
		props: {
			// 商品对象的信息
			goods: {
				type: Object,
				default: {}
			},
			// 按钮的是否展示
			showRadio: {
				type: Boolean,
				// 如果外界没有指定 show-radio 属性的值，则默认不展示 radio 组件
				default: false,
			},
			// 是否展示价格右侧的 NumberBox 组件
			showNum: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				// 默认的图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		computed: {
			tofixed() {
				return Number(this.goods.goods_price).toFixed(2)
			}
		},
		methods: {
			// 勾选按钮的函数
			radioClickHandler() {
				this.$emit('radio-change', {
					// 商品的 Id
					goods_id: this.goods.goods_id,
					// 商品最新的勾选状态
					goods_state: !this.goods.goods_state
				})
			},
			// 数量按钮的函数
			numChangeHandler(num) {
				this.$emit('num-change', {
					// 商品的 Id
					goods_id: this.goods.goods_id,
					// 商品的最新数量
					goods_count: num
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.goods-item-left {
			margin-right: 5px;
			display: flex;
			justify-content: center;
			align-items: center;

			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}

			.goods-info-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.goods-price {
				font-size: 16px;
				color: #c00000;
			}
		}
	}
</style>