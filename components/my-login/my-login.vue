<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<button type="primary" @click="getUserProfile" class="btn-login">一键登录</button>
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		name: "my-login",
		data() {
			return {

			};
		},
		computed: {
			// 调用 mapState 辅助方法，把 m_user 模块中的数据映射到当前用组件中使用
			...mapState('m_user', ['redirction']),
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			// 获取用户的个人信息
			getUserProfile() {
				// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
				// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
				wx.getUserProfile({
					desc: '请验证你的个人信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						//这里需要将获取的 res.userInfo 存起来，你可以存在数据库，也可以存在local storage里
						//wx.request...请求接口
						// 将信息存到 vuex 中
						this.updateUserInfo(res.userInfo)
						this.getToken(res)
					},
					fail: (res) => {
						return uni.showToast({
							title: '您取消了登录授权',
							icon: 'none'
						})
					}
				})
			},
			// 进行登录操作
			async getToken(info) {
				// 调用微信的登录接口
				const [err, res] = await uni.login().catch(err => err)
				// 登录失败
				if (err || res.errMsg !== 'login:ok') return uni.showToast({
					title: '登录失败！',
					icon: 'none'
				})
				// 登录的参数对象
				let query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}
				// 向服务器换取token
				let {
					data: loginResult
				} = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				// 接口问题  自己模拟token
				if (loginResult.meta.status === 400) {
					loginResult.meta.status = 200
					loginResult.meta.msg = '预设返回的数据',
						loginResult.message =
						"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
					uni.showToast({
						title: '登录成功',
						icon: 'none'
					})
					// console.log(loginResult);
					this.updateToken(loginResult.message)
					if (this.redirction) {
						uni.switchTab({
							// 要导航到的页面地址
							url: this.redirction.from,
							// 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
							complete: () => {
								this.updateRedirectInfo(null)
							}
						})
					}

				} else {
					uni.showToast({
						title: '登录成功！',
						icon: 'none'
					})
				}

			},
		}
	}
</script>

<style lang="scss">
	.login-container {
		// 登录盒子的样式
		height: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
		position: relative;
		overflow: hidden;

		// 绘制登录盒子底部的半椭圆造型
		&::after {
			content: ' ';
			display: block;
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			background-color: white;
			border-radius: 100%;
			transform: translateY(50%);
		}

		// 登录按钮的样式
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #c00000;
		}

		// 按钮下方提示消息的样式
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>