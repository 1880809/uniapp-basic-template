<template>
	<!-- 注册界面 -->
	<view class="container">
    <u-navbar class="navbar" :title="$t('register.register')" :autoBack="true"></u-navbar>
		<view class="form-box">
			<view class="tabs-box">
				<view class="tabs-item" :class="{'active':loginType == 'phone'}" @click="changeLoginType('phone')">
					{{$t('register.phoneLogin')}}
				</view>
				<!-- <view class="tabs-item" :class="{'active':loginType == 'email'}" @click="changeLoginType('email')">
					{{$t('register.emailLogin')}}
				</view> -->
			</view>
			<view class="input-box">
				<view class="item" v-if="loginType == 'phone'">
<!--					 <view class="icon phone">
					</view>-->
<!--					<picker mode="multiSelector" @columnchange="columnchange" :value="codeIndex" class="areaCode" @change="areaCodeSelectConfirm" :range="areaCodeList" range-key="areaName">-->
<!--						<label>+{{areaCode}}</label>-->
<!--					</picker>-->
          <view class="country-text" @click="countryShow = true">+{{areaCode}}</view>
					<view class="number">
						<input type="text" class="c-input" v-model="phone" placeholder-class="c-input-place"
							:placeholder="$t('register.phone')" />
					</view>
				</view>


				<view class="item">
					<view class="number">
						<input :password="pswType" class="c-input" v-model="password" placeholder-class="c-input-place"
							:placeholder="$t('register.password')" />
					</view>
					<view class="handle-box" v-if="password">
						<view class="see" v-if="pswType" @click="lookPsw('visible', 1)"></view>
						<view class="see not-see" v-else @click="lookPsw('invisible', 1)"></view>
					</view>
				</view>
        <view class="item">
          <view class="number">
            <input :password="confirmationPswType" class="c-input" v-model="confirmationPassword" placeholder-class="c-input-place"
                   :placeholder="$t('message.confirmation') + $t('register.password')" />
          </view>
          <view class="handle-box" v-if="confirmationPassword">
            <view class="see" v-if="confirmationPswType" @click="lookPsw('visible', 2)"></view>
            <view class="see not-see" v-else @click="lookPsw('invisible', 2)"></view>
          </view>
        </view>

        <view class="item auth-code-box">
          <view class="number">
            <input type="text" class="c-input" v-model="imgCode" placeholder-class="c-input-place" style="width: 400rpx;"
                   :placeholder="$t('register.authCode')" />
          </view>

<!--          <image class="img-code" :src="imgCodeImgs" @click="getCerifyCode" v-if="imgCodeImgs"/>-->
          <view v-html="imgCodeImgs" class="imgCode-box" @click="getCerifyCode">loading...</view>
        </view>

				<view class="item">
					<!-- <view class="icon invite">
					</view> -->
					<view class="number">
						<input type="text" class="c-input" v-model="invite" placeholder-class="c-input-place"
							:placeholder="$t('register.invite')" :disabled="inviteDis" />
					</view>
				</view>
			</view>

      <view class="handle-box">
        <view class="register-btn">

        </view>
        <view class="register-btn" @click="JumpPage('/pages/login/login')">
          <text>{{$t('message.alreadyAccount')}}</text>
          <image class="go-right" src="/static/images/white-back.png"/>
        </view>
      </view>

			<view class="confirm-btn btn" @click="register">
				{{$t('register.register')}}
			</view>

<!--			<view class="deal-text">-->
<!--				{{$t('login.dealLeft')}}<br/><text class="service-contract"-->
<!--					@click="checkPolicies('policy')">《{{$t('login.policy')}}》</text>{{$t('login.yu')}}<text class="service-contract"-->
<!--					@click="checkPolicies('agreement')">《{{$t('login.agreement')}}》</text>-->
<!--			</view>-->
		</view>

    <country @getCountrieCode="getCountrieCode" v-if="countryShow"></country>

	</view>
</template>

<script>
	import country from '../../components/country/country'

	export default {
		components: {
      country,
		},
		data() {
			return {
				areaCode:'1',
				codeIndex:[0,0],
				areaCodeData:[],
				areaCodeList:[],
				phone: '',
				password: '',
        confirmationPassword: '',
        // 密码类型
        confirmationPswType: true,
				email: '',
				// 验证码
				authCode: '',
				// 邀请码
				invite: '',
				// 密码类型
				pswType: true,
				// 登录类型
				loginType: 'phone',
				show: false,
				// 协议类型
				policiesType: 'policy',
				inviteDis: false,
        // 图片验证码
        imgCode: '',
        imgCodeImgs: 'loading...',
        code_id: '',
        // 国家地区
        countryShow: false,

        isH5: false,
			}
		},
		onLoad(option) {
			if (option.invite) {
				this.inviteDis = true;
			} else {
				this.inviteDis = false;
			}
			this.invite = option.invite;
			// this.getAreaCodeData();
			this.getCerifyCode();

		},
		onShow() {

		},
		methods: {

      getCountrieCode(event) {
        if(event.dialCode) {
          this.areaCode = event.dialCode
        }
        this.countryShow = false
      },
      getCerifyCode(){
        this.imgCodeImgs = 'loading...'
        this.$http('/api/sendcode', 'GET')
            .then(data => {
              this.imgCodeImgs = data.data
              let time = this.imgCodeImgs.substring(this.imgCodeImgs.indexOf('?') + 1)
              this.code_id = time.substring(0, time.indexOf('"'))
            }).catch((data) => {
        })
      },
			getAreaCodeData(){
				this.$http('/api/getAreaCodeList', 'GET')
				.then(data => {
					this.areaCodeData = data.data.data;
					this.getAreaCodeList();
				})
			},
			getAreaCodeList(){
				this.areaCodeList = [];
				let codeList = [];
				let codeName = [];
				for(let i=0; i < this.areaCodeData.length; i++){
          codeList.push(this.areaCodeData[i]['phone_code']);
					codeName.push(this.areaCodeData[i]['en']);
				}
				this.areaCodeList = [codeList, codeName];
			},
			columnchange(e){
				let value = e.detail.value;
				this.codeIndex = [value,value];
			},
			areaCodeSelectConfirm(e){
				this.codeIndex = e.target.value;
				this.areaCode = this.areaCodeData[this.codeIndex[0]]['phone_code'];
			},
			closePopups() {
				this.show = !this.show;
			},
			lookPsw(auth, type) {
        if(type == 1) {
          this.pswType = auth !== 'visible' ? true : false;
        } else {
          this.confirmationPswType = auth !== 'visible' ? true : false;
        }
			},
			// 更换登录方式
			changeLoginType(type) {
				this.loginType = type;
				this.phone = this.email = this.password = this.authCode = this.invite = '';
			},
			// 点击注册
			register() {
				let _that = this,
					requestData = {
						tel: '',
						email: '',
					}

				if (_that.loginType == 'email') {
					if (!_that.email) {
						this.$message(_that.$t('login.email'));
						return false;
					}
					requestData = Object.assign(requestData, {
						email: _that.email,
						type: 2
					})
				} else {
					if (!_that.phone) {
						this.$message(_that.$t('login.phone'));
						return false;
					}
					requestData = Object.assign(requestData, {
						tel: _that.phone,
						type: 1
					})
				}
				/* if (!_that.authCode) {
					this.$message(_that.$t('register.authCode'));
					return false;
				} */
				if (!_that.password || !_that.confirmationPassword || (_that.confirmationPassword !== _that.password)) {
					this.$message(_that.$t('login.password'));
					return false;
				}

        if(!this.invite) {
          this.$message(_that.$t('message.pleaseInvit'));
          return false
        }


				requestData = Object.assign(requestData, {
					password: _that.password,
          confirm_pwd: _that.password,
					invite_code: _that.invite,
					code: _that.authCode,
          code_id: this.code_id,
					areaCode: '+' + _that.areaCode,
          verifyCode: _that.imgCode,
				})
				this.$http('/api/register', 'POST', requestData)
					.then(data => {
            localStorage.setItem('rememberPassword', JSON.stringify({
              phone: _that.phone,
              email: _that.email,
              password: _that.password
            }))
            this.$message(_that.$t('formatPassword.confirm'));
						setTimeout(() => {
              _that.email = _that.phone = _that.password = _that.authCode = _that.invite = '';

              this.JumpPage('/pages/login/login')
              // this.isSb(
              //     () => {
              //       this.JumpPage('/pages/login/download')
              //     },
              //     () => {
              //       this.JumpPage('/pages/login/download')
              //     },
              //     () => {
              //       this.JumpPage('/pages/login/login')
              //     },
              //     () => {
              //       this.JumpPage('/pages/login/login')
              //     },
              // )
						}, 1000)
					})
			},



		}
	}
</script>

<style lang="scss" scoped>
	.container {
		text-align: center;
	}
	.areaCode{
		padding: 0rpx 16rpx;
		border-right: 1px solid #aaa;
	}
	.form-box {
		width: 694rpx;
		margin: 0 auto;
		margin-top: 40rpx;

		.tabs-box {
      display: flex;
			justify-content: space-between;
			.tabs-item {
				margin-right: 80rpx;
				font-size: 52upx;
				&.active {
				}
			}
		}

		.input-box {
			width: 694rpx;
			margin: 0 auto;
			margin-top: 40rpx;

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
				&.auth-code-box {
					.auth {
						position: absolute;
						right: 76rpx;
					}
				}

				.icon {
					width: 46rpx;
					height: 46rpx;
          background: url(/static/images/login/icon_signin_phone.png) no-repeat;
          background-size: 100%;

					&.email {
            background: url(/static/images/login/icon_signin_email.png) no-repeat;
            background-size: 100%;
					}

					&.password {
            background: url(/static/images/login/icon_signin_key.png) no-repeat;
            background-size: 100%;
					}

					&.auth-code {
            background: url(/static/images/login/icon_signup_yanzhengma.png) no-repeat;
            background-size: 100%;
					}

					&.invite {
            background: url(/static/images/login/icon_signup_yaoqingma.png) no-repeat;
            background-size: 100%;
					}
				}

				.number {
					margin-left: 16rpx;

					.c-input {
						width: 500rpx;
						height: 92rpx;
						margin-top: 0;
						text-align: left;
						border-bottom: none;
            color: #000;
					}
				}


				.handle-box {
				  display: flex;
					margin: 0;

					.see {
						width: 46rpx;
						height: 46rpx;
            background: url(/static/images/login/icon_signin_eye.png) no-repeat;
            background-size: 100%;
					}

					.not-see {
            background: url(/static/images/login/icon_signin_noeye.png) no-repeat;
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
		margin-top: 98rpx;
		border-radius: 46rpx;
		padding: 31rpx 0px;
		font-size: 30rpx;
	}

	.handle-box {
    display: flex;
		margin-top: 20rpx;
    padding-right:20rpx;
		justify-content: space-between;
    font-size: 16px;
    color: #383630;
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
		margin-top: 32rpx;
		font-size: 24upx;
		text-align: center;
		color: #999;
		line-height: 40rpx;
		.service-contract {
			color: #266BEB;
		}
	}
  .img-code{
    width: 200rpx;
    height: 75rpx;
    position: relative;
    right: 30rpx;
    border-radius: 8rpx;
    //border-radius: 0 46rpx 46rpx 0;
  }

  /deep/ .imgCode-box{
    display: flex;
    align-items: center;
    text-align: center;
    img{
      width: 200rpx;
      height: 80rpx;
      border-radius: 20rpx;
    }
  }

  .country-text{
    height: 50%;
    line-height: 46rpx;
    border-right: 2rpx solid #777777;
    padding-right: 16rpx;
  }


</style>
