<template>
	<view>
		<!-- 使用自定义的搜索组件 -->
		<view class="search-box">
			<my-search @click="gotoSearch"></my-search>
		</view>
		<!-- 首页轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="item in swiperList" :key="item.goods_id">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
					<img :src="item.image_src">
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 首页导航部分 -->
		<view class="nav-list">
			<view @click="navClickHandler(item)" class="nav-item" v-for="(item, i) in navList" :key="i">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>
		<!-- 首页楼层区域 -->
		<view class="floor-list">
			<!-- 楼层 item 项 -->
			<view class="floor-item" v-for="(item, i) in floorList" :key="i">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧大图片的盒子 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src"
							:style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- 右侧 4 个小图片的盒子 -->
					<view class="right-img-box">
						<navigator :url="item2.url" class="right-img-item" v-for="(item2, i2) in item.product_list"
							:key="i2" v-if="i2 !== 0">
							<image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}">
							</image>
						</navigator>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 轮播图的数据列表
				swiperList: [],
				// 分类导航的数据列表
				navList: [],
				// 楼层的数据列表
				floorList: []
			};
		},
		methods: {
			// 获取轮播图的数据
			async getSwiperList() {
				let {
					data: res
				} = await uni.$http.get('/api/public/v1/home/swiperdata')
				// 请求失败
				if (res.meta.status !== 200) return
				this.swiperList = res.message
			},
			// 获取分类导航的数据
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/catitems')
				if (res.meta.status !== 200) return
				this.navList = res.message
			},
			// nav-item 项被点击时候的事件处理函数
			navClickHandler(item) {
				// 判断点击的是哪个 nav
				if (item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},
			// 定义获取楼层列表数据的方法
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata')
				if (res.meta.status !== 200) return
				// 对返回的数据进行处理，添加一个携带query参数的转向分包的url
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						// 创建一个新的属性
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
					})
				})
				this.floorList = res.message
			},
			// 搜索框的处理函数
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		},
		// 生命周期函数
		onLoad() {
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		}
	}
</script>

<style lang="scss">
	// 搜索框
	.search-box{
		position: sticky;
		top: 0;
		z-index: 999;
	}
	// 轮播图部分
	swiper {
		height: 330rpx;

		.swiper-item,
		img {
			width: 100%;
			height: 100%;
		}
	}

	// 导航栏部分
	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15rpx 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	// 楼层部分
	.floor-list {
		.floor-title {
			height: 60rpx;
			width: 100%;
			display: flex;
		}

		.right-img-box {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
		}

		.floor-img-box {
			display: flex;
			padding-left: 10rpx;
		}
	}
</style>