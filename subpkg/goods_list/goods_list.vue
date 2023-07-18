<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求体参数
				queryObj: {
					// 查询的关键字
					query: '',
					// 商品分类id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示的数据
					pagesize: 10
				},
				// 商品列表的数据
				goodsList: [],
				// 总的数量，用来实现分页
				total: 0,
				// 是否正在请求数据
				isloading: false
			};
		},
		onLoad(options) {
			// 将页面参数转存到 this.queryObj 对象中
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			// 调用获取商品列表数据的方法
			this.getGoodsList()
		},
		methods: {
			// 获取商品列表数据的方法
			async getGoodsList(callBack) {
				this.isloading = true
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				this.isloading = false
				// 如果正在下拉刷新，则立即停止
				callBack&&callBack()
				if (res.meta.status !== 200) return
				// 为数据合并
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
			},
			// 跳转到商品的详情页
			gotoDetail(goods){
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id='+goods.goods_id
				})
			}
		},
		// 触底的事件
		onReachBottom() {
			// 判断是否所有的数据已经加载完毕
			if (this.queryObj.pagenum * this.queryObj.pagesize > this.total) return uni.showToast({
				title:"已经到底啦！",
				duration:100,
				icon: 'none',
			})
			// 判断是否正在请求其它数据，如果是，则不发起额外的请求
			if (this.isloading) return

			this.queryObj.pagenum += 1
			this.getGoodsList()
		},
		// 下拉刷新的事件
		onPullDownRefresh() {
			// 重置一些页面的数据
			this.queryObj.pagenum=1
			this.total=0
			this.isloading=false
			this.goodsList=[]
			// 重新发起请求，同时传入停止下拉刷新的回调函数
			this.getGoodsList(()=>{uni.stopPullDownRefresh()})
			
		}
	}
</script>

<style lang="scss">

</style>