<template>
	<view class="goods-detail-container">
		<view class="container">
			<!-- 轮播图区域 -->
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
				<swiper-item v-for="(item,i) in goods_info.pics" :key="i">
					<image :src="item.pics_big" @click="preview(i)"></image>
				</swiper-item>
			</swiper>
			<!-- 商品信息区域 -->
			<view class="goods-info-box">
				<!-- 商品价格 -->
				<view class="price" v-if="goods_info.goods_price">￥{{goods_info.goods_price}}</view>
				<!-- 信息主体区域 -->
				<view class="goods-info-body">
					<!-- 商品名称 -->
					<view class="goods-name">{{goods_info.goods_name}}</view>
					<!-- 收藏 -->
					<view class="favi">
						<uni-icons type="star" size="18" color="gray"></uni-icons>
						<text>收藏</text>
					</view>
				</view>
				<!-- 运费 -->
				<view class="yf">快递：免运费</view>
			</view>
			<!-- 商品详情信息 -->
			<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		</view>
		<!-- 底部购物信息 -->
		<view class="goods-carts">
			<uni-goods-nav :options="options" :fill="true" :button-group="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 商品详情对象
				goods_info: {},
				// 底部购物信息
				options: [{
					icon: 'shop',
					text: '店铺',
					infoColor: "#f5f5f5"
				}, {
					icon: 'cart',
					text: '购物车',
					info: 2
				}],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
						color: '#fff'
					}
				],
			};
		},
		onLoad(options) {
			// 获取商品的id
			const goods_id = options.goods_id
			// 获取商品的详情
			this.getGoodsDetail(goods_id)
		},
		methods: {
			// 获取商品的详情
			async getGoodsDetail(goods_id) {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/detail', {
					goods_id
				})
				if (res.meta.status !== 200) return
				// 为富文本进行样式的编辑
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,
					'<img style="display:block;" ')
				// 为 data 中的数据赋值
				this.goods_info = res.message
			},
			// 预览图片
			preview(i) {
				// 预览图片的方法
				uni.previewImage({
					// 预览时，显示图片的索引
					current: i,
					// 储存所有图片的url地址
					urls: this.goods_info.pics.map(x => x.pics_big)
				})
			},
			// 底部购物信息
			onClick(e) {
				if (e.content.text === '购物车') {
					// 切换页面
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
				if (e.content.text === '店铺') {
					uni.showToast({
						title: '店铺还在添加中~',
						icon:'none'
					})
				}
			},
			buttonClick(e) {
				if (e.content.text === '加入购物车') {
					uni.showToast({
						title: '加入购物车成功！',
					})
				}

			}
		}
	}
</script>

<style lang="scss">
	.goods-detail-container {
		padding-bottom: 50px;

		swiper {
			height: 750rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		// 商品信息区域的样式
		.goods-info-box {
			padding: 10px;
			padding-right: 0;

			.price {
				color: #c00000;
				font-size: 18px;
				margin: 10px 0;
			}

			.goods-info-body {
				display: flex;
				justify-content: space-between;

				.goods-name {
					font-size: 13px;
					padding-right: 10px;
				}

				// 收藏区域
				.favi {
					width: 120px;
					font-size: 12px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					border-left: 1px solid #efefef;
					color: gray;
				}
			}

			// 运费
			.yf {
				margin: 10px 0;
				font-size: 12px;
				color: gray;
			}
		}

		.goods-carts {
			// 为商品导航组件添加固定定位 
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
		}
	}
</style>