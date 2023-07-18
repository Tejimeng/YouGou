<template>
	<view>
		<view class="search-box">
			<!-- 使用uni提供的组件 -->
			<uni-search-bar v-model="kw" @input="input" bgColor="#fff" :focus="true" :radius="100"
				cancelButton="none"></uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length!==0">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons @click="cleanHistory" type="trash-filled" size="20"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag @click="gotoGoodsList(item)" :text="item" v-for="(item, i) in historyList" :key="i"
					custom-style="background-color: #ccc; border-color: #fff; color: #fff;"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 定时器
				timer: null,
				// 搜索的关键词
				kw: '',
				// 搜索结果的列表
				searchResults: [],
				// 搜索关键词的历史记录
				historyList: []
			};
		},
		methods: {
			// 输入框的函数
			input() {
				// 设置一个防抖效果
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					// 根据关键词，查询搜索建议列表
					this.getSearchList()
				}, 500)
			},
			// 获取搜索的结果
			async getSearchList() {
				// 先对关键词进行判断
				if (this.kw.trim() === '') {
					this.searchResults = []
					return
				}
				// 发起请求，获取搜索建议列表
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.kw
				})
				if (res.meta.status !== 200) return
				this.searchResults = res.message
				// 将搜索历史进行保存
				this.saveSearchHistory()
			},
			// 点击跳转详情页
			gotoDetail(goods_id) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
				this.kw=''
			},
			// 保存搜素历史
			saveSearchHistory() {
				// 向开头添加数据
				this.historyList.unshift(this.kw)
				// 进行去重
				this.historyList = [...new Set(this.historyList)]
				// 将数据存储到本地，进行持久化
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			// 清空历史搜索
			cleanHistory(){
				this.historyList=[]
				uni.removeStorageSync('kw')
				// 显示清除成功
				uni.showToast({
					title:"清除成功！",
					duration:1200,
					icon: 'none',
				})
			},
			// 点击历史搜索记录再次搜索
			gotoGoodsList(item){
				this.kw=item
			}
		},
		onLoad() {
			// 获取本地的搜索历史
			// 注意这个[]是一个字符串
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		}
	}
</script>

<style lang="scss">
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
		background-color: #c00000;
	}

	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goods-name {
				// 文字不允许换行（单行文本）
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				display: block;
				margin: 3px 5px;
			}
		}
	}
</style>