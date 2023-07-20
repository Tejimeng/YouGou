<template>
	<view>
		<!-- 使用自定义的搜索组件 -->
		<my-search @click="gotoSearch"></my-search>
		<view class="scroll-view-container">
			<!-- 左侧的滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y="true" :style="{height:wh+'px'}">
				<view @click="activeChanged(index)" v-for="(item,index) in cateList" :key="index"
					:class="['left-scroll-view-item',index===active?'active':'']">
					{{item.cat_name}}
				</view>

			</scroll-view>
			<!-- 右侧的滚动视图区域 -->
			<scroll-view class="right-scroll-view" scroll-y="true" :style="{height:wh+'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2,index2) in cateLevel2" :key="index2">
					<!-- 标题 -->
					<view class="cate-lv2-title">
						/ {{item2.cat_name}} /
					</view>
					<!-- 每一个标题下的内容区域 -->
					<view class="cate-lv3-list">
						<!-- 每一个小的内容 -->
						<view @click="gotoGoodsList(item3)" class="cate-lv3-item" v-for="(item3,index3) in item2.children" :key="index3">
							<!-- 图片 -->
							<img :src="item3.cat_icon" :alt="item3.cat_name">
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	// 导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		// 将 badgeMix 混入到当前的页面中进行使用
		  mixins: [badgeMix],
		data() {
			return {
				// 窗口的可用高度
				wh: 0,
				// 分类数据列表
				cateList: [],
				// 激活的选择项
				active: 0,
				// 二次分类列表
				cateLevel2: [],
				// 滚动条距离顶部的距离
				scrollTop: 0

			};
		},
		methods: {
			// 获取左侧分类列表
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				if (res.meta.status !== 200) return
				// 左侧列表的数据
				this.cateList = res.message
				// 右侧二级分类列表的初始数据
				this.cateLevel2 = res.message[0].children
			},
			// 修改激活项的函数
			activeChanged(index) {
				// 回归到顶部
				// 必须每次都是不一样的值
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
				this.active = index
				// 修改二次分类的数据
				this.cateLevel2 = this.cateList[index].children
			},
			// 点击进行路由跳转
			gotoGoodsList(item){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?cid='+item.cat_id
				})
			},
			// 搜素组件的自定义函数
			gotoSearch(){
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}

		},
		onLoad() {
			// 获取当前系统的信息
			const sysInfo = uni.getSystemInfoSync()
			// 获取当前的可用高度
			this.wh = sysInfo.windowHeight-50
			this.getCateList()
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			width: 120px;

			.left-scroll-view-item {
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;

				// 选中时的样式
				&.active {
					background-color: #ccc;
					position: relative;

					// 渲染激活项左侧的红色指示边线 
					&::before {
						content: " ";
						display: block;
						width: 3px;
						height: 40px;
						background-color: #c00000;
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
					}
				}
			}
		}
	}

	.right-scroll-view {

		.cate-lv2-title {
			font-size: 12px;
			font-weight: bold;
			text-align: center;
			padding: 15px 0;
		}

		.cate-lv3-list {
			display: flex;
			flex-wrap: wrap;

			.cate-lv3-item {
				width: 33.33%;
				margin-bottom: 10px;
				display: flex;
				flex-direction: column;
				align-items: center;

				img {
					width: 60px;
					height: 60px;
				}

				text {
					font-size: 12px;
				}
			}
		}
	}
</style>