<template>
	<!-- 设置语言 -->
	<view class="container">
    <u-navbar class="navbar" :title="$t('login.lang')" :autoBack="true"></u-navbar>
		<view class="tabs">
<!--			<view class="tab-item " v-for="(item, index) in langList" :key="index" @click="switchLanguage(item.key)">
				<view class="language">
          {{ item.name }}
				</view>
				<view class="icon" v-show="isLanguage === item.key">
				</view>
			</view>-->
			<view class="tab-item" @click="switchLanguage('zh')">
				<view class="language">
					中文
				</view>
				<view class="icon" v-show="isLanguage == 'zh'">
				</view>
			</view>
			<view class="tab-item" @click="switchLanguage('en')">
				<view class="language">
					English
				</view>
				<view class="icon" v-show="isLanguage == 'en'">
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				// 当前语言
				isLanguage: 'en',
        langList: []
			}
		},
		onLoad() {
			this.isLanguage = uni.getStorageSync('locale')||'en';
		},

		onShow() {

      // this.getLangList()
		},
		methods: {
      getLangList() {
        uni.showLoading();
        this.$http('/api/get_lang_list', 'GET').then(res => {
          uni.hideLoading()
          if(res.data) {
           this.langList = res.data
          }
        })
      },
			// 切换语言
			switchLanguage(language) {
				uni.showLoading({
					title: 'loading...',
					mask: true,
				})
				this.isLanguage = language;
				// #ifdef H5
				localStorage.setItem('locale', this.isLanguage);
				// #endif
				this._i18n.locale = this.isLanguage;
        uni.navigateBack()
			},
		}
	}
</script>

<style lang="scss" scoped>

	.tabs {
		width: 694rpx;
		margin: 0 auto;

		.tab-item {
			height: 88rpx;
			line-height: 88rpx;
      display: flex;
      align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid;

      &:nth-of-type(1) {
        //border-bottom: none;
      }
			.language {
				font-size: 28upx;
      }

			.icon {
				width: 44rpx;
				height: 44rpx;
        background: url(/static/images/icon_language_selected.png) no-repeat;
        background-size: 100%;
			}
		}
	}
</style>
