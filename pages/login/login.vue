<template>
	<!-- 登陆界面 -->
	<view class="container ">
    <u-navbar class="navbar" :leftIcon="''">
      <template v-slot:right >
        <view @click="JumpPage('/pages/my/set-language')" >
          {{$t('my.chooseLanguage')}}
          <image class="go-lang" src="/static/images/white-back.png"/>
        </view>
      </template>
    </u-navbar>
		<view class="logo-box">
      logo
		</view>
		<view class="app-name">
			{{$t('login.appName')}}
		</view>
		<view class="form-box">
			<view class="tabs-box">
				<view class="tabs-item" :class="{'active':loginType == 'phone'}" @click="changeLoginType('phone')">
					{{$t('login.phoneLogin')}}
				</view>
				<!-- <view class="tabs-item" :class="{'active':loginType == 'email'}" @click="changeLoginType('email')">
					{{$t('login.emailLogin')}}
				</view> -->
			</view>
			<view class="input-box">
				<view class="item">
					<!-- <view class="icon phone">
					</view> -->
					<view class="number">
						<input type="text" class="c-input" v-model="phone" placeholder-class="c-input-place"
							:placeholder="$t('login.phone')" />
					</view>

				</view>


				<view class="item">
					<view class="number">
						<input :password="pswType" class="c-input" v-model="password" placeholder-class="c-input-place"
							:placeholder="$t('login.password')" />
					</view>
					<view class="handle-box" v-if="password">
						<view class="see" v-if="pswType" @click="lookPsw('visible')"></view>
						<view class="see not-see" v-else @click="lookPsw('invisible')"></view>
					</view>
				</view>
			</view>
      <view class="handle-box">
        <checkbox-group class="checkbox-box" @change="rememberChange">
          <label>
            <checkbox value="1" :checked="isRememberPas"/> <view class="remember-text">{{$t('message.passwordRemember')}}</view>
          </label>
        </checkbox-group>
        <view class="register-btn" @click="JumpPage('/pages/login/register')">
         <text> {{$t('login.register')}}</text>
          <image class="go-right" src="/static/images/white-back.png"/>
        </view>
      </view>
			<view class="handle-box">
<!--				<view class="register-btn" @click="JumpPage('/pages/login/register')">-->
<!--					{{$t('login.register')}}-->
<!--				</view>-->
<!--				<view class="forget-password" @click="JumpPage('/pages/login/format-password')">-->
<!--					{{$t('login.forgetPassword')}}-->
<!--				</view>-->
			</view>
			<view class="confirm-btn btn" @click="login">
				{{$t('login.login')}}
			</view>


<!--      <view class="download-text" v-if="isH5">-->
      <view class="download-text">
        <text class="service-contract" @click="JumpPage('/pages/login/download')">{{$t('message.download')}}</text>
      </view>


		</view>
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				phone: '',
				password: '',
				email: '',
				// 密码类型
				pswType: true,
				// 登录类型
				loginType: 'phone',
				show: false,
        // 记住密码
        isRememberPas: true,

        isH5: false,
			}
		},
		onShow() {
      // 记住密码
      let user = JSON.parse(localStorage.getItem('rememberPassword'))
      if(user) {
        this.phone = user.phone
        this.email = user.email
        this.password = user.password
        this.isRememberPas = true
      }

      // this.isSb(
      //     () => {
      //       this.isH5 = true
      //     },
      //     () => {
      //       this.isH5 = true
      //     },
      //     () => {
      //       this.isH5 = false
      //     },
      //     () => {
      //       this.isH5 = false
      //     }
      // )
		},
		methods: {
      rememberChange (e) {
        let values = e.detail.value;
        this.isRememberPas = values.length > 0
      },
			closePopups() {
				this.show = !this.show;
			},
			lookPsw(auth) {
				this.pswType = auth !== 'visible' ? true : false;
			},
			// 更换登录方式 手机号/邮箱
			changeLoginType(type) {
				this.loginType = type
				this.phone = this.email = this.password = ''
			},
			// 登录
			login() {
				let _that = this,
					type = 1;
				if (_that.loginType == 'phone') {
					if (!_that.phone) {
						this.$message(_that.$t('login.phone'));
						return false;
					}
					type = 1
				} else {
					if (!_that.email) {
						this.$message(_that.$t('login.email'));
						return false;
					}
					type = 2
				}
				if (!_that.password) {
					this.$message(_that.$t('login.password'));
					return false;
				}
				this.$http('/api/login', 'POST', {
						tel: _that.phone,
						email: _that.email,
						password: _that.password,
						type: type
					})
					.then(data => {
            if(this.isRememberPas) {
              localStorage.setItem('rememberPassword', JSON.stringify({
                phone: this.phone,
                email: this.email,
                password: this.password
              }))
            } else {
              localStorage.removeItem('rememberPassword')
            }
						this.$store.commit('SET_LOGIN_INFO', data.data.data);
						this.$message(data.data.msg);
						setTimeout(() => {
              _that.phone = _that.email = _that.password = ''
							this.JumpPage('/pages/home/index', {}, 1)
						}, 1000)
					})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		text-align: center;
	}

  .navbar{
    position: relative;
  }
  .go-lang{
    display: inline-block;
    margin-left: 5rpx;
    width: 30rpx;
    height: 30rpx;
    transform: rotate(270deg);
  }
	.logo-box {
		width: 180rpx;
		height: 180rpx;
		margin: 160rpx auto 0;
		image {
			width: 180rpx;
			height: 180rpx;
		}
	}

	.app-name {
		margin-top: 20rpx;
	}

	.form-box {
		width: 694rpx;
		margin: 0 auto;
		margin-top: 70rpx;

		.tabs-box {
      display: flex;
			// justify-content: space-around;
			justify-content: space-between;
			.tabs-item {
				font-size: 52upx;
				&.active {
				}
			}
		}

		.input-box {
			width: 694rpx;
			margin: 0 auto;
			margin-top: 72rpx;

			.item {
				height: 92rpx;
        display: flex;
				justify-content: flex-start;
        align-items: center;
				border-bottom: 1rpx solid;
				border-radius: 46rpx;
				margin-bottom: 30rpx;
				background: #f8f8f8;
				padding-left: 48rpx;
				.icon {
					width: 46rpx;
					height: 46rpx;


				}

				.number {
					margin-left: 16rpx;

					.c-input {
						width: 504rpx;
						height: 92rpx;
						margin-top: 0;
						text-align: left;
						border-bottom: none;
					}
				}

				.handle-box {
					margin: 0;

					.see {
						width: 46rpx;
						height: 46rpx;
            background: url("/static/images/login/icon_signin_eye.png") no-repeat;
            background-size: 100%;
					}

					.not-see {
            background: url("/static/images/login/icon_signin_noeye.png") no-repeat;
            background-size: 100%;
					}

					image {
						width: 46rpx;
						height: 46rpx;
						margin-right: 20rpx;
					}
				}
			}
		}
	}

	.btn {
		margin-top: 60rpx;
		border-radius: 46rpx;
		padding: 31rpx 0px;
		font-size: 30rpx;
	}
	.forget-password{
		font-size: 28rpx;
	}
	.handle-box {
    display: flex;
		margin-top: 20rpx;
		justify-content: space-between;
		color: #383630;
		font-size: 32rpx;
    .register-btn{
      display: flex;
      align-items: center;
    }
    .go-right{
      width: 27rpx;
      height: 27rpx;
      transform: rotate(180deg);
    }
	}

	.deal-text {
		position: fixed;
		display: block;
		left: 0;
		right: 0;
		margin: 0 auto;
		bottom: 40rpx;
		font-size: 24upx;
	}
  .service-contract {
    color: #266BEB;
    font-size: 24upx;
  }
  .download-text{
    padding-top: 100rpx;
  }

	.popup-box {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		background-color: rgba($color: #000000, $alpha: 0.6);
	}

  .checkbox-box{
    .remember-text{
      font-size: 24rpx;
    }
    /deep/ uni-checkbox .uni-checkbox-input{
      width:26rpx;
      height:26rpx;
    }
    /deep/ uni-checkbox .uni-checkbox-wrapper{
      display: flex;
    }
    /deep/ .uni-label-pointer{
      display: flex;
      align-items: center;
    }
  }
</style>
