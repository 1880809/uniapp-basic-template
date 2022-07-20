<template>
	<!-- 国家地区 -->
	<view>

    <view class="popup-bg"  @click="getCountrieCode"></view>
    <view class="popup-box">
      <view class="search-title-box">
        <image class="search-img" src="../../static/images/search.png"  mode="widthFix"/>
        <input type="text" v-model="value" class="search-input" @input="onInput" placeholder="Enter search keywords">
      </view>
      <view class="search-content">

        <view class="search-list" v-for="(item, key, index) in countriesArray" :key="index" @click="getCountrieCode(item)">
          <view class="search-list-left">
            <view class="iti-flag" :class="[key]"/>
            <view class="search-list-text">{{ item['name'] }}</view>
          </view>
          <view class="search-list-text">+{{item['dialCode']}}</view>
        </view>
      </view>
    </view>
	</view>
</template>

<script>
	import countryList from './countryList.js'
	export default {
		components: {

		},
		data() {
			return {
        countriesArray: [],
        value: '',
			}
		},
		created() {
      this.countriesArray = countryList;
      for (let item in countryList) {
        let searchval = countryList[item].name.toLowerCase() + "@" + countryList[item].dialCode;
        countryList[item].searchval = searchval;
      }
		},
		methods: {
			getCountrieCode(item){
        // console.log(item.dialCode)
        this.$emit('getCountrieCode', item)
			},
      onInput() {
        if(this.value) {
          let countriesArray = JSON.parse(JSON.stringify(countryList))
          this.countriesArray = {};
          for (const item in countriesArray) {
            if (countriesArray[item]['searchval'].indexOf(this.value) > -1) {
              this.countriesArray[item] = countriesArray[item]
            }
          }
        } else {
          this.countriesArray = countryList;
        }

      }
		}
	}
</script>

<style lang="scss" scoped>
@import "./countryIntl.css";
  .popup-bg{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    z-index: 9998;
  }
  .popup-box{
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 9999;
    width: 88%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 10rpx;
    padding-bottom: 14rpx;
  }
  .search-title-box{
    background-color: #f7f8fa;
    margin: 16rpx auto;
    width: 95%;
    height: 64rpx;
    padding: 0 10rpx;
    line-height: 64rpx;
    text-align: left;
    border-radius: 4rpx;
    display: flex;
    align-items: center;
    .search-img{
      width: 48rpx;
      margin-right: 5rpx;
    }
    .search-input{
      flex: 1;
      font-size: 26rpx;
    }
  }

  .search-content{
    height: 500rpx;
    overflow-y: scroll;
    .search-list{
      width: 95%;
      margin: 16rpx auto 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .iti-flag{
      margin-right: 6rpx;
    }
    .search-list-text{
      text-align: left;
    }
    .search-list-left{
      display: flex;
      align-items: center;
    }
  }
</style>
